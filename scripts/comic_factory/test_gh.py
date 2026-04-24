"""Tests for gh.py — GitHub/git operations wrapper."""
import json
import subprocess
import unittest
from unittest.mock import MagicMock, call, patch

from scripts.comic_factory.gh import (
    CO_AUTHORED_BY,
    close_issue,
    comment_on_issue,
    commit_and_push,
    dispatch_workflow,
    fetch_issue,
    swap_label,
    update_issue_body,
)


def _ok(stdout="", stderr=""):
    """Return a mock CompletedProcess with returncode=0."""
    result = MagicMock()
    result.returncode = 0
    result.stdout = stdout
    result.stderr = stderr
    return result


def _fail(returncode=1, stderr="some error"):
    """Return a mock CompletedProcess with nonzero returncode."""
    result = MagicMock()
    result.returncode = returncode
    result.stdout = ""
    result.stderr = stderr
    return result


class TestFetchIssue(unittest.TestCase):
    def test_fetch_issue_returns_parsed_json(self):
        payload = {
            "number": 42,
            "title": "Comic: Dog Taxes",
            "body": "A dog files taxes badly.",
            "labels": [{"name": "comic-request"}],
        }
        with patch("subprocess.run", return_value=_ok(stdout=json.dumps(payload))) as mock_run:
            result = fetch_issue(42)
        self.assertEqual(result["number"], 42)
        self.assertEqual(result["title"], "Comic: Dog Taxes")
        self.assertIn("labels", result)
        cmd = mock_run.call_args[0][0]
        self.assertEqual(cmd[:4], ["gh", "issue", "view", "42"])
        self.assertIn("--json", cmd)

    def test_fetch_issue_raises_on_nonzero_exit(self):
        with patch("subprocess.run", return_value=_fail(stderr="not found")):
            with self.assertRaises(RuntimeError) as ctx:
                fetch_issue(99)
        self.assertIn("not found", str(ctx.exception))


class TestCommentOnIssue(unittest.TestCase):
    def test_comment_on_issue_calls_correct_cmd(self):
        with patch("subprocess.run", return_value=_ok()) as mock_run:
            comment_on_issue(42, "hello")
        cmd = mock_run.call_args[0][0]
        self.assertEqual(cmd, ["gh", "issue", "comment", "42", "--body", "hello"])

    def test_comment_on_issue_raises_on_nonzero_exit(self):
        with patch("subprocess.run", return_value=_fail(stderr="auth error")):
            with self.assertRaises(RuntimeError) as ctx:
                comment_on_issue(42, "hello")
        self.assertIn("auth error", str(ctx.exception))


class TestUpdateIssueBody(unittest.TestCase):
    def test_update_issue_body_calls_correct_cmd(self):
        with patch("subprocess.run", return_value=_ok()) as mock_run:
            update_issue_body(42, "new body")
        cmd = mock_run.call_args[0][0]
        self.assertEqual(cmd, ["gh", "issue", "edit", "42", "--body", "new body"])

    def test_update_issue_body_raises_on_nonzero_exit(self):
        with patch("subprocess.run", return_value=_fail(stderr="permission denied")):
            with self.assertRaises(RuntimeError) as ctx:
                update_issue_body(42, "new body")
        self.assertIn("permission denied", str(ctx.exception))


class TestSwapLabel(unittest.TestCase):
    def test_swap_label_both_sides(self):
        with patch("subprocess.run", return_value=_ok()) as mock_run:
            swap_label(42, remove="old-label", add="new-label")
        cmd = mock_run.call_args[0][0]
        self.assertIn("--remove-label", cmd)
        self.assertIn("old-label", cmd)
        self.assertIn("--add-label", cmd)
        self.assertIn("new-label", cmd)

    def test_swap_label_add_only(self):
        with patch("subprocess.run", return_value=_ok()) as mock_run:
            swap_label(42, remove=None, add="new-label")
        cmd = mock_run.call_args[0][0]
        self.assertNotIn("--remove-label", cmd)
        self.assertIn("--add-label", cmd)
        self.assertIn("new-label", cmd)

    def test_swap_label_remove_only(self):
        with patch("subprocess.run", return_value=_ok()) as mock_run:
            swap_label(42, remove="old-label", add=None)
        cmd = mock_run.call_args[0][0]
        self.assertIn("--remove-label", cmd)
        self.assertIn("old-label", cmd)
        self.assertNotIn("--add-label", cmd)

    def test_swap_label_raises_on_nonzero_exit(self):
        with patch("subprocess.run", return_value=_fail(stderr="label error")):
            with self.assertRaises(RuntimeError) as ctx:
                swap_label(42, remove="a", add="b")
        self.assertIn("label error", str(ctx.exception))


class TestCloseIssue(unittest.TestCase):
    def test_close_issue_calls_correct_cmd(self):
        with patch("subprocess.run", return_value=_ok()) as mock_run:
            close_issue(42)
        cmd = mock_run.call_args[0][0]
        self.assertEqual(cmd, ["gh", "issue", "close", "42"])

    def test_close_issue_raises_on_nonzero_exit(self):
        with patch("subprocess.run", return_value=_fail(stderr="not found")):
            with self.assertRaises(RuntimeError) as ctx:
                close_issue(42)
        self.assertIn("not found", str(ctx.exception))


class TestCommitAndPush(unittest.TestCase):
    def test_commit_and_push_refuses_data_usage_json(self):
        with patch("subprocess.run") as mock_run:
            with self.assertRaises(ValueError) as ctx:
                commit_and_push(["data/usage.json", "other.py"], "test commit")
        mock_run.assert_not_called()
        self.assertIn("data/usage.json", str(ctx.exception))

    def test_commit_and_push_refuses_empty_paths(self):
        with patch("subprocess.run") as mock_run:
            with self.assertRaises(ValueError):
                commit_and_push([], "test commit")
        mock_run.assert_not_called()

    def test_commit_and_push_happy_path(self):
        paths = ["scripts/comic_factory/gh.py", "scripts/comic_factory/test_gh.py"]
        message = "comics: add GH/git operations wrapper"

        with patch("subprocess.run", return_value=_ok()) as mock_run:
            commit_and_push(paths, message)

        self.assertEqual(mock_run.call_count, 3)
        calls = mock_run.call_args_list

        # git add with explicit paths
        add_cmd = calls[0][0][0]
        self.assertEqual(add_cmd, ["git", "add"] + paths)

        # git commit with message + Co-Authored-By trailer
        commit_cmd = calls[1][0][0]
        self.assertEqual(commit_cmd[:2], ["git", "commit"])
        self.assertIn("-m", commit_cmd)
        msg_index = commit_cmd.index("-m") + 1
        full_message = commit_cmd[msg_index]
        self.assertIn(message, full_message)
        self.assertIn(CO_AUTHORED_BY, full_message)

        # git push
        push_cmd = calls[2][0][0]
        self.assertEqual(push_cmd, ["git", "push"])

    def test_commit_and_push_raises_on_git_add_failure(self):
        with patch("subprocess.run", return_value=_fail(stderr="no such file")):
            with self.assertRaises(RuntimeError) as ctx:
                commit_and_push(["some_file.py"], "msg")
        self.assertIn("no such file", str(ctx.exception))


class TestDispatchWorkflow(unittest.TestCase):
    def test_dispatch_workflow_calls_correct_cmd(self):
        with patch("subprocess.run", return_value=_ok()) as mock_run:
            dispatch_workflow("comic-publish.yml")
        cmd = mock_run.call_args[0][0]
        self.assertEqual(cmd, ["gh", "workflow", "run", "comic-publish.yml"])

    def test_dispatch_workflow_raises_on_nonzero_exit(self):
        with patch("subprocess.run", return_value=_fail(stderr="workflow error")):
            with self.assertRaises(RuntimeError) as ctx:
                dispatch_workflow("comic-publish.yml")
        self.assertIn("workflow error", str(ctx.exception))


if __name__ == "__main__":
    unittest.main()
