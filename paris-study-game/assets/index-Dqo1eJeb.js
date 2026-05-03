(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();const af="modulepreload",cf=function(n){return"/paris-study-game/"+n},Jc={},lf=function(e,t,i){let s=Promise.resolve();if(t&&t.length>0){document.getElementsByTagName("link");const o=document.querySelector("meta[property=csp-nonce]"),a=o?.nonce||o?.getAttribute("nonce");s=Promise.allSettled(t.map(c=>{if(c=cf(c),c in Jc)return;Jc[c]=!0;const l=c.endsWith(".css"),u=l?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${u}`))return;const d=document.createElement("link");if(d.rel=l?"stylesheet":af,l||(d.as="script"),d.crossOrigin="",d.href=c,a&&d.setAttribute("nonce",a),document.head.appendChild(d),l)return new Promise((h,f)=>{d.addEventListener("load",h),d.addEventListener("error",()=>f(new Error(`Unable to preload CSS for ${c}`)))})}))}function r(o){const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=o,window.dispatchEvent(a),!a.defaultPrevented)throw o}return s.then(o=>{for(const a of o||[])a.status==="rejected"&&r(a.reason);return e().catch(r)})};function Y(n,e,t){function i(a,c){if(a._zod||Object.defineProperty(a,"_zod",{value:{def:c,constr:o,traits:new Set},enumerable:!1}),a._zod.traits.has(n))return;a._zod.traits.add(n),e(a,c);const l=o.prototype,u=Object.keys(l);for(let d=0;d<u.length;d++){const h=u[d];h in a||(a[h]=l[h].bind(a))}}const s=t?.Parent??Object;class r extends s{}Object.defineProperty(r,"name",{value:n});function o(a){var c;const l=t?.Parent?new r:this;i(l,a),(c=l._zod).deferred??(c.deferred=[]);for(const u of l._zod.deferred)u();return l}return Object.defineProperty(o,"init",{value:i}),Object.defineProperty(o,Symbol.hasInstance,{value:a=>t?.Parent&&a instanceof t.Parent?!0:a?._zod?.traits?.has(n)}),Object.defineProperty(o,"name",{value:n}),o}class ss extends Error{constructor(){super("Encountered Promise during synchronous parse. Use .parseAsync() instead.")}}class mh extends Error{constructor(e){super(`Encountered unidirectional transform during encode: ${e}`),this.name="ZodEncodeError"}}const gh={};function Ti(n){return gh}function _h(n){const e=Object.values(n).filter(i=>typeof i=="number");return Object.entries(n).filter(([i,s])=>e.indexOf(+i)===-1).map(([i,s])=>s)}function ma(n,e){return typeof e=="bigint"?e.toString():e}function pc(n){return{get value(){{const e=n();return Object.defineProperty(this,"value",{value:e}),e}}}}function mc(n){return n==null}function gc(n){const e=n.startsWith("^")?1:0,t=n.endsWith("$")?n.length-1:n.length;return n.slice(e,t)}function uf(n,e){const t=(n.toString().split(".")[1]||"").length,i=e.toString();let s=(i.split(".")[1]||"").length;if(s===0&&/\d?e-\d?/.test(i)){const c=i.match(/\d?e-(\d?)/);c?.[1]&&(s=Number.parseInt(c[1]))}const r=t>s?t:s,o=Number.parseInt(n.toFixed(r).replace(".","")),a=Number.parseInt(e.toFixed(r).replace(".",""));return o%a/10**r}const Qc=Symbol("evaluating");function nt(n,e,t){let i;Object.defineProperty(n,e,{get(){if(i!==Qc)return i===void 0&&(i=Qc,i=t()),i},set(s){Object.defineProperty(n,e,{value:s})},configurable:!0})}function Ci(n,e,t){Object.defineProperty(n,e,{value:t,writable:!0,enumerable:!0,configurable:!0})}function hi(...n){const e={};for(const t of n){const i=Object.getOwnPropertyDescriptors(t);Object.assign(e,i)}return Object.defineProperties({},e)}function el(n){return JSON.stringify(n)}function hf(n){return n.toLowerCase().trim().replace(/[^\w\s-]/g,"").replace(/[\s_-]+/g,"-").replace(/^-+|-+$/g,"")}const vh="captureStackTrace"in Error?Error.captureStackTrace:(...n)=>{};function kr(n){return typeof n=="object"&&n!==null&&!Array.isArray(n)}const df=pc(()=>{if(typeof navigator<"u"&&navigator?.userAgent?.includes("Cloudflare"))return!1;try{const n=Function;return new n(""),!0}catch{return!1}});function Hs(n){if(kr(n)===!1)return!1;const e=n.constructor;if(e===void 0||typeof e!="function")return!0;const t=e.prototype;return!(kr(t)===!1||Object.prototype.hasOwnProperty.call(t,"isPrototypeOf")===!1)}function xh(n){return Hs(n)?{...n}:Array.isArray(n)?[...n]:n}const ff=new Set(["string","number","symbol"]);function cs(n){return n.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function di(n,e,t){const i=new n._zod.constr(e??n._zod.def);return(!e||t?.parent)&&(i._zod.parent=n),i}function we(n){const e=n;if(!e)return{};if(typeof e=="string")return{error:()=>e};if(e?.message!==void 0){if(e?.error!==void 0)throw new Error("Cannot specify both `message` and `error` params");e.error=e.message}return delete e.message,typeof e.error=="string"?{...e,error:()=>e.error}:e}function pf(n){return Object.keys(n).filter(e=>n[e]._zod.optin==="optional"&&n[e]._zod.optout==="optional")}const mf={safeint:[Number.MIN_SAFE_INTEGER,Number.MAX_SAFE_INTEGER],int32:[-2147483648,2147483647],uint32:[0,4294967295],float32:[-34028234663852886e22,34028234663852886e22],float64:[-Number.MAX_VALUE,Number.MAX_VALUE]};function gf(n,e){const t=n._zod.def,i=t.checks;if(i&&i.length>0)throw new Error(".pick() cannot be used on object schemas containing refinements");const r=hi(n._zod.def,{get shape(){const o={};for(const a in e){if(!(a in t.shape))throw new Error(`Unrecognized key: "${a}"`);e[a]&&(o[a]=t.shape[a])}return Ci(this,"shape",o),o},checks:[]});return di(n,r)}function _f(n,e){const t=n._zod.def,i=t.checks;if(i&&i.length>0)throw new Error(".omit() cannot be used on object schemas containing refinements");const r=hi(n._zod.def,{get shape(){const o={...n._zod.def.shape};for(const a in e){if(!(a in t.shape))throw new Error(`Unrecognized key: "${a}"`);e[a]&&delete o[a]}return Ci(this,"shape",o),o},checks:[]});return di(n,r)}function vf(n,e){if(!Hs(e))throw new Error("Invalid input to extend: expected a plain object");const t=n._zod.def.checks;if(t&&t.length>0){const r=n._zod.def.shape;for(const o in e)if(Object.getOwnPropertyDescriptor(r,o)!==void 0)throw new Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.")}const s=hi(n._zod.def,{get shape(){const r={...n._zod.def.shape,...e};return Ci(this,"shape",r),r}});return di(n,s)}function xf(n,e){if(!Hs(e))throw new Error("Invalid input to safeExtend: expected a plain object");const t=hi(n._zod.def,{get shape(){const i={...n._zod.def.shape,...e};return Ci(this,"shape",i),i}});return di(n,t)}function Mf(n,e){const t=hi(n._zod.def,{get shape(){const i={...n._zod.def.shape,...e._zod.def.shape};return Ci(this,"shape",i),i},get catchall(){return e._zod.def.catchall},checks:[]});return di(n,t)}function Sf(n,e,t){const s=e._zod.def.checks;if(s&&s.length>0)throw new Error(".partial() cannot be used on object schemas containing refinements");const o=hi(e._zod.def,{get shape(){const a=e._zod.def.shape,c={...a};if(t)for(const l in t){if(!(l in a))throw new Error(`Unrecognized key: "${l}"`);t[l]&&(c[l]=n?new n({type:"optional",innerType:a[l]}):a[l])}else for(const l in a)c[l]=n?new n({type:"optional",innerType:a[l]}):a[l];return Ci(this,"shape",c),c},checks:[]});return di(e,o)}function yf(n,e,t){const i=hi(e._zod.def,{get shape(){const s=e._zod.def.shape,r={...s};if(t)for(const o in t){if(!(o in r))throw new Error(`Unrecognized key: "${o}"`);t[o]&&(r[o]=new n({type:"nonoptional",innerType:s[o]}))}else for(const o in s)r[o]=new n({type:"nonoptional",innerType:s[o]});return Ci(this,"shape",r),r}});return di(e,i)}function is(n,e=0){if(n.aborted===!0)return!0;for(let t=e;t<n.issues.length;t++)if(n.issues[t]?.continue!==!0)return!0;return!1}function Mh(n,e){return e.map(t=>{var i;return(i=t).path??(i.path=[]),t.path.unshift(n),t})}function Qs(n){return typeof n=="string"?n:n?.message}function Ai(n,e,t){const i={...n,path:n.path??[]};if(!n.message){const s=Qs(n.inst?._zod.def?.error?.(n))??Qs(e?.error?.(n))??Qs(t.customError?.(n))??Qs(t.localeError?.(n))??"Invalid input";i.message=s}return delete i.inst,delete i.continue,e?.reportInput||delete i.input,i}function _c(n){return Array.isArray(n)?"array":typeof n=="string"?"string":"unknown"}function Vs(...n){const[e,t,i]=n;return typeof e=="string"?{message:e,code:"custom",input:t,inst:i}:{...e}}const Sh=(n,e)=>{n.name="$ZodError",Object.defineProperty(n,"_zod",{value:n._zod,enumerable:!1}),Object.defineProperty(n,"issues",{value:e,enumerable:!1}),n.message=JSON.stringify(e,ma,2),Object.defineProperty(n,"toString",{value:()=>n.message,enumerable:!1})},yh=Y("$ZodError",Sh),bh=Y("$ZodError",Sh,{Parent:Error});function bf(n,e=t=>t.message){const t={},i=[];for(const s of n.issues)s.path.length>0?(t[s.path[0]]=t[s.path[0]]||[],t[s.path[0]].push(e(s))):i.push(e(s));return{formErrors:i,fieldErrors:t}}function Ef(n,e=t=>t.message){const t={_errors:[]},i=s=>{for(const r of s.issues)if(r.code==="invalid_union"&&r.errors.length)r.errors.map(o=>i({issues:o}));else if(r.code==="invalid_key")i({issues:r.issues});else if(r.code==="invalid_element")i({issues:r.issues});else if(r.path.length===0)t._errors.push(e(r));else{let o=t,a=0;for(;a<r.path.length;){const c=r.path[a];a===r.path.length-1?(o[c]=o[c]||{_errors:[]},o[c]._errors.push(e(r))):o[c]=o[c]||{_errors:[]},o=o[c],a++}}};return i(n),t}const vc=n=>(e,t,i,s)=>{const r=i?Object.assign(i,{async:!1}):{async:!1},o=e._zod.run({value:t,issues:[]},r);if(o instanceof Promise)throw new ss;if(o.issues.length){const a=new(s?.Err??n)(o.issues.map(c=>Ai(c,r,Ti())));throw vh(a,s?.callee),a}return o.value},xc=n=>async(e,t,i,s)=>{const r=i?Object.assign(i,{async:!0}):{async:!0};let o=e._zod.run({value:t,issues:[]},r);if(o instanceof Promise&&(o=await o),o.issues.length){const a=new(s?.Err??n)(o.issues.map(c=>Ai(c,r,Ti())));throw vh(a,s?.callee),a}return o.value},eo=n=>(e,t,i)=>{const s=i?{...i,async:!1}:{async:!1},r=e._zod.run({value:t,issues:[]},s);if(r instanceof Promise)throw new ss;return r.issues.length?{success:!1,error:new(n??yh)(r.issues.map(o=>Ai(o,s,Ti())))}:{success:!0,data:r.value}},Tf=eo(bh),to=n=>async(e,t,i)=>{const s=i?Object.assign(i,{async:!0}):{async:!0};let r=e._zod.run({value:t,issues:[]},s);return r instanceof Promise&&(r=await r),r.issues.length?{success:!1,error:new n(r.issues.map(o=>Ai(o,s,Ti())))}:{success:!0,data:r.value}},Af=to(bh),wf=n=>(e,t,i)=>{const s=i?Object.assign(i,{direction:"backward"}):{direction:"backward"};return vc(n)(e,t,s)},Rf=n=>(e,t,i)=>vc(n)(e,t,i),Cf=n=>async(e,t,i)=>{const s=i?Object.assign(i,{direction:"backward"}):{direction:"backward"};return xc(n)(e,t,s)},Pf=n=>async(e,t,i)=>xc(n)(e,t,i),If=n=>(e,t,i)=>{const s=i?Object.assign(i,{direction:"backward"}):{direction:"backward"};return eo(n)(e,t,s)},Lf=n=>(e,t,i)=>eo(n)(e,t,i),Nf=n=>async(e,t,i)=>{const s=i?Object.assign(i,{direction:"backward"}):{direction:"backward"};return to(n)(e,t,s)},Df=n=>async(e,t,i)=>to(n)(e,t,i),Uf=/^[cC][^\s-]{8,}$/,Of=/^[0-9a-z]+$/,Ff=/^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/,zf=/^[0-9a-vA-V]{20}$/,Bf=/^[A-Za-z0-9]{27}$/,kf=/^[a-zA-Z0-9_-]{21}$/,Gf=/^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/,Hf=/^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/,tl=n=>n?new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${n}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`):/^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/,Vf=/^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/,Wf="^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";function Xf(){return new RegExp(Wf,"u")}const Zf=/^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,$f=/^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/,qf=/^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/,jf=/^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/,Yf=/^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/,Eh=/^[A-Za-z0-9_-]*$/,Kf=/^\+[1-9]\d{6,14}$/,Th="(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))",Jf=new RegExp(`^${Th}$`);function Ah(n){const e="(?:[01]\\d|2[0-3]):[0-5]\\d";return typeof n.precision=="number"?n.precision===-1?`${e}`:n.precision===0?`${e}:[0-5]\\d`:`${e}:[0-5]\\d\\.\\d{${n.precision}}`:`${e}(?::[0-5]\\d(?:\\.\\d+)?)?`}function Qf(n){return new RegExp(`^${Ah(n)}$`)}function ep(n){const e=Ah({precision:n.precision}),t=["Z"];n.local&&t.push(""),n.offset&&t.push("([+-](?:[01]\\d|2[0-3]):[0-5]\\d)");const i=`${e}(?:${t.join("|")})`;return new RegExp(`^${Th}T(?:${i})$`)}const tp=n=>{const e=n?`[\\s\\S]{${n?.minimum??0},${n?.maximum??""}}`:"[\\s\\S]*";return new RegExp(`^${e}$`)},np=/^-?\d+$/,ip=/^-?\d+(?:\.\d+)?$/,sp=/^[^A-Z]*$/,rp=/^[^a-z]*$/,Yt=Y("$ZodCheck",(n,e)=>{var t;n._zod??(n._zod={}),n._zod.def=e,(t=n._zod).onattach??(t.onattach=[])}),wh={number:"number",bigint:"bigint",object:"date"},Rh=Y("$ZodCheckLessThan",(n,e)=>{Yt.init(n,e);const t=wh[typeof e.value];n._zod.onattach.push(i=>{const s=i._zod.bag,r=(e.inclusive?s.maximum:s.exclusiveMaximum)??Number.POSITIVE_INFINITY;e.value<r&&(e.inclusive?s.maximum=e.value:s.exclusiveMaximum=e.value)}),n._zod.check=i=>{(e.inclusive?i.value<=e.value:i.value<e.value)||i.issues.push({origin:t,code:"too_big",maximum:typeof e.value=="object"?e.value.getTime():e.value,input:i.value,inclusive:e.inclusive,inst:n,continue:!e.abort})}}),Ch=Y("$ZodCheckGreaterThan",(n,e)=>{Yt.init(n,e);const t=wh[typeof e.value];n._zod.onattach.push(i=>{const s=i._zod.bag,r=(e.inclusive?s.minimum:s.exclusiveMinimum)??Number.NEGATIVE_INFINITY;e.value>r&&(e.inclusive?s.minimum=e.value:s.exclusiveMinimum=e.value)}),n._zod.check=i=>{(e.inclusive?i.value>=e.value:i.value>e.value)||i.issues.push({origin:t,code:"too_small",minimum:typeof e.value=="object"?e.value.getTime():e.value,input:i.value,inclusive:e.inclusive,inst:n,continue:!e.abort})}}),op=Y("$ZodCheckMultipleOf",(n,e)=>{Yt.init(n,e),n._zod.onattach.push(t=>{var i;(i=t._zod.bag).multipleOf??(i.multipleOf=e.value)}),n._zod.check=t=>{if(typeof t.value!=typeof e.value)throw new Error("Cannot mix number and bigint in multiple_of check.");(typeof t.value=="bigint"?t.value%e.value===BigInt(0):uf(t.value,e.value)===0)||t.issues.push({origin:typeof t.value,code:"not_multiple_of",divisor:e.value,input:t.value,inst:n,continue:!e.abort})}}),ap=Y("$ZodCheckNumberFormat",(n,e)=>{Yt.init(n,e),e.format=e.format||"float64";const t=e.format?.includes("int"),i=t?"int":"number",[s,r]=mf[e.format];n._zod.onattach.push(o=>{const a=o._zod.bag;a.format=e.format,a.minimum=s,a.maximum=r,t&&(a.pattern=np)}),n._zod.check=o=>{const a=o.value;if(t){if(!Number.isInteger(a)){o.issues.push({expected:i,format:e.format,code:"invalid_type",continue:!1,input:a,inst:n});return}if(!Number.isSafeInteger(a)){a>0?o.issues.push({input:a,code:"too_big",maximum:Number.MAX_SAFE_INTEGER,note:"Integers must be within the safe integer range.",inst:n,origin:i,inclusive:!0,continue:!e.abort}):o.issues.push({input:a,code:"too_small",minimum:Number.MIN_SAFE_INTEGER,note:"Integers must be within the safe integer range.",inst:n,origin:i,inclusive:!0,continue:!e.abort});return}}a<s&&o.issues.push({origin:"number",input:a,code:"too_small",minimum:s,inclusive:!0,inst:n,continue:!e.abort}),a>r&&o.issues.push({origin:"number",input:a,code:"too_big",maximum:r,inclusive:!0,inst:n,continue:!e.abort})}}),cp=Y("$ZodCheckMaxLength",(n,e)=>{var t;Yt.init(n,e),(t=n._zod.def).when??(t.when=i=>{const s=i.value;return!mc(s)&&s.length!==void 0}),n._zod.onattach.push(i=>{const s=i._zod.bag.maximum??Number.POSITIVE_INFINITY;e.maximum<s&&(i._zod.bag.maximum=e.maximum)}),n._zod.check=i=>{const s=i.value;if(s.length<=e.maximum)return;const o=_c(s);i.issues.push({origin:o,code:"too_big",maximum:e.maximum,inclusive:!0,input:s,inst:n,continue:!e.abort})}}),lp=Y("$ZodCheckMinLength",(n,e)=>{var t;Yt.init(n,e),(t=n._zod.def).when??(t.when=i=>{const s=i.value;return!mc(s)&&s.length!==void 0}),n._zod.onattach.push(i=>{const s=i._zod.bag.minimum??Number.NEGATIVE_INFINITY;e.minimum>s&&(i._zod.bag.minimum=e.minimum)}),n._zod.check=i=>{const s=i.value;if(s.length>=e.minimum)return;const o=_c(s);i.issues.push({origin:o,code:"too_small",minimum:e.minimum,inclusive:!0,input:s,inst:n,continue:!e.abort})}}),up=Y("$ZodCheckLengthEquals",(n,e)=>{var t;Yt.init(n,e),(t=n._zod.def).when??(t.when=i=>{const s=i.value;return!mc(s)&&s.length!==void 0}),n._zod.onattach.push(i=>{const s=i._zod.bag;s.minimum=e.length,s.maximum=e.length,s.length=e.length}),n._zod.check=i=>{const s=i.value,r=s.length;if(r===e.length)return;const o=_c(s),a=r>e.length;i.issues.push({origin:o,...a?{code:"too_big",maximum:e.length}:{code:"too_small",minimum:e.length},inclusive:!0,exact:!0,input:i.value,inst:n,continue:!e.abort})}}),no=Y("$ZodCheckStringFormat",(n,e)=>{var t,i;Yt.init(n,e),n._zod.onattach.push(s=>{const r=s._zod.bag;r.format=e.format,e.pattern&&(r.patterns??(r.patterns=new Set),r.patterns.add(e.pattern))}),e.pattern?(t=n._zod).check??(t.check=s=>{e.pattern.lastIndex=0,!e.pattern.test(s.value)&&s.issues.push({origin:"string",code:"invalid_format",format:e.format,input:s.value,...e.pattern?{pattern:e.pattern.toString()}:{},inst:n,continue:!e.abort})}):(i=n._zod).check??(i.check=()=>{})}),hp=Y("$ZodCheckRegex",(n,e)=>{no.init(n,e),n._zod.check=t=>{e.pattern.lastIndex=0,!e.pattern.test(t.value)&&t.issues.push({origin:"string",code:"invalid_format",format:"regex",input:t.value,pattern:e.pattern.toString(),inst:n,continue:!e.abort})}}),dp=Y("$ZodCheckLowerCase",(n,e)=>{e.pattern??(e.pattern=sp),no.init(n,e)}),fp=Y("$ZodCheckUpperCase",(n,e)=>{e.pattern??(e.pattern=rp),no.init(n,e)}),pp=Y("$ZodCheckIncludes",(n,e)=>{Yt.init(n,e);const t=cs(e.includes),i=new RegExp(typeof e.position=="number"?`^.{${e.position}}${t}`:t);e.pattern=i,n._zod.onattach.push(s=>{const r=s._zod.bag;r.patterns??(r.patterns=new Set),r.patterns.add(i)}),n._zod.check=s=>{s.value.includes(e.includes,e.position)||s.issues.push({origin:"string",code:"invalid_format",format:"includes",includes:e.includes,input:s.value,inst:n,continue:!e.abort})}}),mp=Y("$ZodCheckStartsWith",(n,e)=>{Yt.init(n,e);const t=new RegExp(`^${cs(e.prefix)}.*`);e.pattern??(e.pattern=t),n._zod.onattach.push(i=>{const s=i._zod.bag;s.patterns??(s.patterns=new Set),s.patterns.add(t)}),n._zod.check=i=>{i.value.startsWith(e.prefix)||i.issues.push({origin:"string",code:"invalid_format",format:"starts_with",prefix:e.prefix,input:i.value,inst:n,continue:!e.abort})}}),gp=Y("$ZodCheckEndsWith",(n,e)=>{Yt.init(n,e);const t=new RegExp(`.*${cs(e.suffix)}$`);e.pattern??(e.pattern=t),n._zod.onattach.push(i=>{const s=i._zod.bag;s.patterns??(s.patterns=new Set),s.patterns.add(t)}),n._zod.check=i=>{i.value.endsWith(e.suffix)||i.issues.push({origin:"string",code:"invalid_format",format:"ends_with",suffix:e.suffix,input:i.value,inst:n,continue:!e.abort})}}),_p=Y("$ZodCheckOverwrite",(n,e)=>{Yt.init(n,e),n._zod.check=t=>{t.value=e.tx(t.value)}});class vp{constructor(e=[]){this.content=[],this.indent=0,this&&(this.args=e)}indented(e){this.indent+=1,e(this),this.indent-=1}write(e){if(typeof e=="function"){e(this,{execution:"sync"}),e(this,{execution:"async"});return}const i=e.split(`
`).filter(o=>o),s=Math.min(...i.map(o=>o.length-o.trimStart().length)),r=i.map(o=>o.slice(s)).map(o=>" ".repeat(this.indent*2)+o);for(const o of r)this.content.push(o)}compile(){const e=Function,t=this?.args,s=[...(this?.content??[""]).map(r=>`  ${r}`)];return new e(...t,s.join(`
`))}}const xp={major:4,minor:3,patch:6},Tt=Y("$ZodType",(n,e)=>{var t;n??(n={}),n._zod.def=e,n._zod.bag=n._zod.bag||{},n._zod.version=xp;const i=[...n._zod.def.checks??[]];n._zod.traits.has("$ZodCheck")&&i.unshift(n);for(const s of i)for(const r of s._zod.onattach)r(n);if(i.length===0)(t=n._zod).deferred??(t.deferred=[]),n._zod.deferred?.push(()=>{n._zod.run=n._zod.parse});else{const s=(o,a,c)=>{let l=is(o),u;for(const d of a){if(d._zod.def.when){if(!d._zod.def.when(o))continue}else if(l)continue;const h=o.issues.length,f=d._zod.check(o);if(f instanceof Promise&&c?.async===!1)throw new ss;if(u||f instanceof Promise)u=(u??Promise.resolve()).then(async()=>{await f,o.issues.length!==h&&(l||(l=is(o,h)))});else{if(o.issues.length===h)continue;l||(l=is(o,h))}}return u?u.then(()=>o):o},r=(o,a,c)=>{if(is(o))return o.aborted=!0,o;const l=s(a,i,c);if(l instanceof Promise){if(c.async===!1)throw new ss;return l.then(u=>n._zod.parse(u,c))}return n._zod.parse(l,c)};n._zod.run=(o,a)=>{if(a.skipChecks)return n._zod.parse(o,a);if(a.direction==="backward"){const l=n._zod.parse({value:o.value,issues:[]},{...a,skipChecks:!0});return l instanceof Promise?l.then(u=>r(u,o,a)):r(l,o,a)}const c=n._zod.parse(o,a);if(c instanceof Promise){if(a.async===!1)throw new ss;return c.then(l=>s(l,i,a))}return s(c,i,a)}}nt(n,"~standard",()=>({validate:s=>{try{const r=Tf(n,s);return r.success?{value:r.data}:{issues:r.error?.issues}}catch{return Af(n,s).then(o=>o.success?{value:o.data}:{issues:o.error?.issues})}},vendor:"zod",version:1}))}),Mc=Y("$ZodString",(n,e)=>{Tt.init(n,e),n._zod.pattern=[...n?._zod.bag?.patterns??[]].pop()??tp(n._zod.bag),n._zod.parse=(t,i)=>{if(e.coerce)try{t.value=String(t.value)}catch{}return typeof t.value=="string"||t.issues.push({expected:"string",code:"invalid_type",input:t.value,inst:n}),t}}),pt=Y("$ZodStringFormat",(n,e)=>{no.init(n,e),Mc.init(n,e)}),Mp=Y("$ZodGUID",(n,e)=>{e.pattern??(e.pattern=Hf),pt.init(n,e)}),Sp=Y("$ZodUUID",(n,e)=>{if(e.version){const i={v1:1,v2:2,v3:3,v4:4,v5:5,v6:6,v7:7,v8:8}[e.version];if(i===void 0)throw new Error(`Invalid UUID version: "${e.version}"`);e.pattern??(e.pattern=tl(i))}else e.pattern??(e.pattern=tl());pt.init(n,e)}),yp=Y("$ZodEmail",(n,e)=>{e.pattern??(e.pattern=Vf),pt.init(n,e)}),bp=Y("$ZodURL",(n,e)=>{pt.init(n,e),n._zod.check=t=>{try{const i=t.value.trim(),s=new URL(i);e.hostname&&(e.hostname.lastIndex=0,e.hostname.test(s.hostname)||t.issues.push({code:"invalid_format",format:"url",note:"Invalid hostname",pattern:e.hostname.source,input:t.value,inst:n,continue:!e.abort})),e.protocol&&(e.protocol.lastIndex=0,e.protocol.test(s.protocol.endsWith(":")?s.protocol.slice(0,-1):s.protocol)||t.issues.push({code:"invalid_format",format:"url",note:"Invalid protocol",pattern:e.protocol.source,input:t.value,inst:n,continue:!e.abort})),e.normalize?t.value=s.href:t.value=i;return}catch{t.issues.push({code:"invalid_format",format:"url",input:t.value,inst:n,continue:!e.abort})}}}),Ep=Y("$ZodEmoji",(n,e)=>{e.pattern??(e.pattern=Xf()),pt.init(n,e)}),Tp=Y("$ZodNanoID",(n,e)=>{e.pattern??(e.pattern=kf),pt.init(n,e)}),Ap=Y("$ZodCUID",(n,e)=>{e.pattern??(e.pattern=Uf),pt.init(n,e)}),wp=Y("$ZodCUID2",(n,e)=>{e.pattern??(e.pattern=Of),pt.init(n,e)}),Rp=Y("$ZodULID",(n,e)=>{e.pattern??(e.pattern=Ff),pt.init(n,e)}),Cp=Y("$ZodXID",(n,e)=>{e.pattern??(e.pattern=zf),pt.init(n,e)}),Pp=Y("$ZodKSUID",(n,e)=>{e.pattern??(e.pattern=Bf),pt.init(n,e)}),Ip=Y("$ZodISODateTime",(n,e)=>{e.pattern??(e.pattern=ep(e)),pt.init(n,e)}),Lp=Y("$ZodISODate",(n,e)=>{e.pattern??(e.pattern=Jf),pt.init(n,e)}),Np=Y("$ZodISOTime",(n,e)=>{e.pattern??(e.pattern=Qf(e)),pt.init(n,e)}),Dp=Y("$ZodISODuration",(n,e)=>{e.pattern??(e.pattern=Gf),pt.init(n,e)}),Up=Y("$ZodIPv4",(n,e)=>{e.pattern??(e.pattern=Zf),pt.init(n,e),n._zod.bag.format="ipv4"}),Op=Y("$ZodIPv6",(n,e)=>{e.pattern??(e.pattern=$f),pt.init(n,e),n._zod.bag.format="ipv6",n._zod.check=t=>{try{new URL(`http://[${t.value}]`)}catch{t.issues.push({code:"invalid_format",format:"ipv6",input:t.value,inst:n,continue:!e.abort})}}}),Fp=Y("$ZodCIDRv4",(n,e)=>{e.pattern??(e.pattern=qf),pt.init(n,e)}),zp=Y("$ZodCIDRv6",(n,e)=>{e.pattern??(e.pattern=jf),pt.init(n,e),n._zod.check=t=>{const i=t.value.split("/");try{if(i.length!==2)throw new Error;const[s,r]=i;if(!r)throw new Error;const o=Number(r);if(`${o}`!==r)throw new Error;if(o<0||o>128)throw new Error;new URL(`http://[${s}]`)}catch{t.issues.push({code:"invalid_format",format:"cidrv6",input:t.value,inst:n,continue:!e.abort})}}});function Ph(n){if(n==="")return!0;if(n.length%4!==0)return!1;try{return atob(n),!0}catch{return!1}}const Bp=Y("$ZodBase64",(n,e)=>{e.pattern??(e.pattern=Yf),pt.init(n,e),n._zod.bag.contentEncoding="base64",n._zod.check=t=>{Ph(t.value)||t.issues.push({code:"invalid_format",format:"base64",input:t.value,inst:n,continue:!e.abort})}});function kp(n){if(!Eh.test(n))return!1;const e=n.replace(/[-_]/g,i=>i==="-"?"+":"/"),t=e.padEnd(Math.ceil(e.length/4)*4,"=");return Ph(t)}const Gp=Y("$ZodBase64URL",(n,e)=>{e.pattern??(e.pattern=Eh),pt.init(n,e),n._zod.bag.contentEncoding="base64url",n._zod.check=t=>{kp(t.value)||t.issues.push({code:"invalid_format",format:"base64url",input:t.value,inst:n,continue:!e.abort})}}),Hp=Y("$ZodE164",(n,e)=>{e.pattern??(e.pattern=Kf),pt.init(n,e)});function Vp(n,e=null){try{const t=n.split(".");if(t.length!==3)return!1;const[i]=t;if(!i)return!1;const s=JSON.parse(atob(i));return!("typ"in s&&s?.typ!=="JWT"||!s.alg||e&&(!("alg"in s)||s.alg!==e))}catch{return!1}}const Wp=Y("$ZodJWT",(n,e)=>{pt.init(n,e),n._zod.check=t=>{Vp(t.value,e.alg)||t.issues.push({code:"invalid_format",format:"jwt",input:t.value,inst:n,continue:!e.abort})}}),Ih=Y("$ZodNumber",(n,e)=>{Tt.init(n,e),n._zod.pattern=n._zod.bag.pattern??ip,n._zod.parse=(t,i)=>{if(e.coerce)try{t.value=Number(t.value)}catch{}const s=t.value;if(typeof s=="number"&&!Number.isNaN(s)&&Number.isFinite(s))return t;const r=typeof s=="number"?Number.isNaN(s)?"NaN":Number.isFinite(s)?void 0:"Infinity":void 0;return t.issues.push({expected:"number",code:"invalid_type",input:s,inst:n,...r?{received:r}:{}}),t}}),Xp=Y("$ZodNumberFormat",(n,e)=>{ap.init(n,e),Ih.init(n,e)}),Zp=Y("$ZodUnknown",(n,e)=>{Tt.init(n,e),n._zod.parse=t=>t}),$p=Y("$ZodNever",(n,e)=>{Tt.init(n,e),n._zod.parse=(t,i)=>(t.issues.push({expected:"never",code:"invalid_type",input:t.value,inst:n}),t)});function nl(n,e,t){n.issues.length&&e.issues.push(...Mh(t,n.issues)),e.value[t]=n.value}const qp=Y("$ZodArray",(n,e)=>{Tt.init(n,e),n._zod.parse=(t,i)=>{const s=t.value;if(!Array.isArray(s))return t.issues.push({expected:"array",code:"invalid_type",input:s,inst:n}),t;t.value=Array(s.length);const r=[];for(let o=0;o<s.length;o++){const a=s[o],c=e.element._zod.run({value:a,issues:[]},i);c instanceof Promise?r.push(c.then(l=>nl(l,t,o))):nl(c,t,o)}return r.length?Promise.all(r).then(()=>t):t}});function Gr(n,e,t,i,s){if(n.issues.length){if(s&&!(t in i))return;e.issues.push(...Mh(t,n.issues))}n.value===void 0?t in i&&(e.value[t]=void 0):e.value[t]=n.value}function Lh(n){const e=Object.keys(n.shape);for(const i of e)if(!n.shape?.[i]?._zod?.traits?.has("$ZodType"))throw new Error(`Invalid element at key "${i}": expected a Zod schema`);const t=pf(n.shape);return{...n,keys:e,keySet:new Set(e),numKeys:e.length,optionalKeys:new Set(t)}}function Nh(n,e,t,i,s,r){const o=[],a=s.keySet,c=s.catchall._zod,l=c.def.type,u=c.optout==="optional";for(const d in e){if(a.has(d))continue;if(l==="never"){o.push(d);continue}const h=c.run({value:e[d],issues:[]},i);h instanceof Promise?n.push(h.then(f=>Gr(f,t,d,e,u))):Gr(h,t,d,e,u)}return o.length&&t.issues.push({code:"unrecognized_keys",keys:o,input:e,inst:r}),n.length?Promise.all(n).then(()=>t):t}const jp=Y("$ZodObject",(n,e)=>{if(Tt.init(n,e),!Object.getOwnPropertyDescriptor(e,"shape")?.get){const a=e.shape;Object.defineProperty(e,"shape",{get:()=>{const c={...a};return Object.defineProperty(e,"shape",{value:c}),c}})}const i=pc(()=>Lh(e));nt(n._zod,"propValues",()=>{const a=e.shape,c={};for(const l in a){const u=a[l]._zod;if(u.values){c[l]??(c[l]=new Set);for(const d of u.values)c[l].add(d)}}return c});const s=kr,r=e.catchall;let o;n._zod.parse=(a,c)=>{o??(o=i.value);const l=a.value;if(!s(l))return a.issues.push({expected:"object",code:"invalid_type",input:l,inst:n}),a;a.value={};const u=[],d=o.shape;for(const h of o.keys){const f=d[h],g=f._zod.optout==="optional",x=f._zod.run({value:l[h],issues:[]},c);x instanceof Promise?u.push(x.then(m=>Gr(m,a,h,l,g))):Gr(x,a,h,l,g)}return r?Nh(u,l,a,c,i.value,n):u.length?Promise.all(u).then(()=>a):a}}),Yp=Y("$ZodObjectJIT",(n,e)=>{jp.init(n,e);const t=n._zod.parse,i=pc(()=>Lh(e)),s=h=>{const f=new vp(["shape","payload","ctx"]),g=i.value,x=b=>{const y=el(b);return`shape[${y}]._zod.run({ value: input[${y}], issues: [] }, ctx)`};f.write("const input = payload.value;");const m=Object.create(null);let p=0;for(const b of g.keys)m[b]=`key_${p++}`;f.write("const newResult = {};");for(const b of g.keys){const y=m[b],w=el(b),C=h[b]?._zod?.optout==="optional";f.write(`const ${y} = ${x(b)};`),C?f.write(`
        if (${y}.issues.length) {
          if (${w} in input) {
            payload.issues = payload.issues.concat(${y}.issues.map(iss => ({
              ...iss,
              path: iss.path ? [${w}, ...iss.path] : [${w}]
            })));
          }
        }
        
        if (${y}.value === undefined) {
          if (${w} in input) {
            newResult[${w}] = undefined;
          }
        } else {
          newResult[${w}] = ${y}.value;
        }
        
      `):f.write(`
        if (${y}.issues.length) {
          payload.issues = payload.issues.concat(${y}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${w}, ...iss.path] : [${w}]
          })));
        }
        
        if (${y}.value === undefined) {
          if (${w} in input) {
            newResult[${w}] = undefined;
          }
        } else {
          newResult[${w}] = ${y}.value;
        }
        
      `)}f.write("payload.value = newResult;"),f.write("return payload;");const S=f.compile();return(b,y)=>S(h,b,y)};let r;const o=kr,a=!gh.jitless,l=a&&df.value,u=e.catchall;let d;n._zod.parse=(h,f)=>{d??(d=i.value);const g=h.value;return o(g)?a&&l&&f?.async===!1&&f.jitless!==!0?(r||(r=s(e.shape)),h=r(h,f),u?Nh([],g,h,f,d,n):h):t(h,f):(h.issues.push({expected:"object",code:"invalid_type",input:g,inst:n}),h)}});function il(n,e,t,i){for(const r of n)if(r.issues.length===0)return e.value=r.value,e;const s=n.filter(r=>!is(r));return s.length===1?(e.value=s[0].value,s[0]):(e.issues.push({code:"invalid_union",input:e.value,inst:t,errors:n.map(r=>r.issues.map(o=>Ai(o,i,Ti())))}),e)}const Kp=Y("$ZodUnion",(n,e)=>{Tt.init(n,e),nt(n._zod,"optin",()=>e.options.some(s=>s._zod.optin==="optional")?"optional":void 0),nt(n._zod,"optout",()=>e.options.some(s=>s._zod.optout==="optional")?"optional":void 0),nt(n._zod,"values",()=>{if(e.options.every(s=>s._zod.values))return new Set(e.options.flatMap(s=>Array.from(s._zod.values)))}),nt(n._zod,"pattern",()=>{if(e.options.every(s=>s._zod.pattern)){const s=e.options.map(r=>r._zod.pattern);return new RegExp(`^(${s.map(r=>gc(r.source)).join("|")})$`)}});const t=e.options.length===1,i=e.options[0]._zod.run;n._zod.parse=(s,r)=>{if(t)return i(s,r);let o=!1;const a=[];for(const c of e.options){const l=c._zod.run({value:s.value,issues:[]},r);if(l instanceof Promise)a.push(l),o=!0;else{if(l.issues.length===0)return l;a.push(l)}}return o?Promise.all(a).then(c=>il(c,s,n,r)):il(a,s,n,r)}}),Jp=Y("$ZodIntersection",(n,e)=>{Tt.init(n,e),n._zod.parse=(t,i)=>{const s=t.value,r=e.left._zod.run({value:s,issues:[]},i),o=e.right._zod.run({value:s,issues:[]},i);return r instanceof Promise||o instanceof Promise?Promise.all([r,o]).then(([c,l])=>sl(t,c,l)):sl(t,r,o)}});function ga(n,e){if(n===e)return{valid:!0,data:n};if(n instanceof Date&&e instanceof Date&&+n==+e)return{valid:!0,data:n};if(Hs(n)&&Hs(e)){const t=Object.keys(e),i=Object.keys(n).filter(r=>t.indexOf(r)!==-1),s={...n,...e};for(const r of i){const o=ga(n[r],e[r]);if(!o.valid)return{valid:!1,mergeErrorPath:[r,...o.mergeErrorPath]};s[r]=o.data}return{valid:!0,data:s}}if(Array.isArray(n)&&Array.isArray(e)){if(n.length!==e.length)return{valid:!1,mergeErrorPath:[]};const t=[];for(let i=0;i<n.length;i++){const s=n[i],r=e[i],o=ga(s,r);if(!o.valid)return{valid:!1,mergeErrorPath:[i,...o.mergeErrorPath]};t.push(o.data)}return{valid:!0,data:t}}return{valid:!1,mergeErrorPath:[]}}function sl(n,e,t){const i=new Map;let s;for(const a of e.issues)if(a.code==="unrecognized_keys"){s??(s=a);for(const c of a.keys)i.has(c)||i.set(c,{}),i.get(c).l=!0}else n.issues.push(a);for(const a of t.issues)if(a.code==="unrecognized_keys")for(const c of a.keys)i.has(c)||i.set(c,{}),i.get(c).r=!0;else n.issues.push(a);const r=[...i].filter(([,a])=>a.l&&a.r).map(([a])=>a);if(r.length&&s&&n.issues.push({...s,keys:r}),is(n))return n;const o=ga(e.value,t.value);if(!o.valid)throw new Error(`Unmergable intersection. Error path: ${JSON.stringify(o.mergeErrorPath)}`);return n.value=o.data,n}const Qp=Y("$ZodEnum",(n,e)=>{Tt.init(n,e);const t=_h(e.entries),i=new Set(t);n._zod.values=i,n._zod.pattern=new RegExp(`^(${t.filter(s=>ff.has(typeof s)).map(s=>typeof s=="string"?cs(s):s.toString()).join("|")})$`),n._zod.parse=(s,r)=>{const o=s.value;return i.has(o)||s.issues.push({code:"invalid_value",values:t,input:o,inst:n}),s}}),em=Y("$ZodLiteral",(n,e)=>{if(Tt.init(n,e),e.values.length===0)throw new Error("Cannot create literal schema with no valid values");const t=new Set(e.values);n._zod.values=t,n._zod.pattern=new RegExp(`^(${e.values.map(i=>typeof i=="string"?cs(i):i?cs(i.toString()):String(i)).join("|")})$`),n._zod.parse=(i,s)=>{const r=i.value;return t.has(r)||i.issues.push({code:"invalid_value",values:e.values,input:r,inst:n}),i}}),tm=Y("$ZodTransform",(n,e)=>{Tt.init(n,e),n._zod.parse=(t,i)=>{if(i.direction==="backward")throw new mh(n.constructor.name);const s=e.transform(t.value,t);if(i.async)return(s instanceof Promise?s:Promise.resolve(s)).then(o=>(t.value=o,t));if(s instanceof Promise)throw new ss;return t.value=s,t}});function rl(n,e){return n.issues.length&&e===void 0?{issues:[],value:void 0}:n}const Dh=Y("$ZodOptional",(n,e)=>{Tt.init(n,e),n._zod.optin="optional",n._zod.optout="optional",nt(n._zod,"values",()=>e.innerType._zod.values?new Set([...e.innerType._zod.values,void 0]):void 0),nt(n._zod,"pattern",()=>{const t=e.innerType._zod.pattern;return t?new RegExp(`^(${gc(t.source)})?$`):void 0}),n._zod.parse=(t,i)=>{if(e.innerType._zod.optin==="optional"){const s=e.innerType._zod.run(t,i);return s instanceof Promise?s.then(r=>rl(r,t.value)):rl(s,t.value)}return t.value===void 0?t:e.innerType._zod.run(t,i)}}),nm=Y("$ZodExactOptional",(n,e)=>{Dh.init(n,e),nt(n._zod,"values",()=>e.innerType._zod.values),nt(n._zod,"pattern",()=>e.innerType._zod.pattern),n._zod.parse=(t,i)=>e.innerType._zod.run(t,i)}),im=Y("$ZodNullable",(n,e)=>{Tt.init(n,e),nt(n._zod,"optin",()=>e.innerType._zod.optin),nt(n._zod,"optout",()=>e.innerType._zod.optout),nt(n._zod,"pattern",()=>{const t=e.innerType._zod.pattern;return t?new RegExp(`^(${gc(t.source)}|null)$`):void 0}),nt(n._zod,"values",()=>e.innerType._zod.values?new Set([...e.innerType._zod.values,null]):void 0),n._zod.parse=(t,i)=>t.value===null?t:e.innerType._zod.run(t,i)}),sm=Y("$ZodDefault",(n,e)=>{Tt.init(n,e),n._zod.optin="optional",nt(n._zod,"values",()=>e.innerType._zod.values),n._zod.parse=(t,i)=>{if(i.direction==="backward")return e.innerType._zod.run(t,i);if(t.value===void 0)return t.value=e.defaultValue,t;const s=e.innerType._zod.run(t,i);return s instanceof Promise?s.then(r=>ol(r,e)):ol(s,e)}});function ol(n,e){return n.value===void 0&&(n.value=e.defaultValue),n}const rm=Y("$ZodPrefault",(n,e)=>{Tt.init(n,e),n._zod.optin="optional",nt(n._zod,"values",()=>e.innerType._zod.values),n._zod.parse=(t,i)=>(i.direction==="backward"||t.value===void 0&&(t.value=e.defaultValue),e.innerType._zod.run(t,i))}),om=Y("$ZodNonOptional",(n,e)=>{Tt.init(n,e),nt(n._zod,"values",()=>{const t=e.innerType._zod.values;return t?new Set([...t].filter(i=>i!==void 0)):void 0}),n._zod.parse=(t,i)=>{const s=e.innerType._zod.run(t,i);return s instanceof Promise?s.then(r=>al(r,n)):al(s,n)}});function al(n,e){return!n.issues.length&&n.value===void 0&&n.issues.push({code:"invalid_type",expected:"nonoptional",input:n.value,inst:e}),n}const am=Y("$ZodCatch",(n,e)=>{Tt.init(n,e),nt(n._zod,"optin",()=>e.innerType._zod.optin),nt(n._zod,"optout",()=>e.innerType._zod.optout),nt(n._zod,"values",()=>e.innerType._zod.values),n._zod.parse=(t,i)=>{if(i.direction==="backward")return e.innerType._zod.run(t,i);const s=e.innerType._zod.run(t,i);return s instanceof Promise?s.then(r=>(t.value=r.value,r.issues.length&&(t.value=e.catchValue({...t,error:{issues:r.issues.map(o=>Ai(o,i,Ti()))},input:t.value}),t.issues=[]),t)):(t.value=s.value,s.issues.length&&(t.value=e.catchValue({...t,error:{issues:s.issues.map(r=>Ai(r,i,Ti()))},input:t.value}),t.issues=[]),t)}}),cm=Y("$ZodPipe",(n,e)=>{Tt.init(n,e),nt(n._zod,"values",()=>e.in._zod.values),nt(n._zod,"optin",()=>e.in._zod.optin),nt(n._zod,"optout",()=>e.out._zod.optout),nt(n._zod,"propValues",()=>e.in._zod.propValues),n._zod.parse=(t,i)=>{if(i.direction==="backward"){const r=e.out._zod.run(t,i);return r instanceof Promise?r.then(o=>er(o,e.in,i)):er(r,e.in,i)}const s=e.in._zod.run(t,i);return s instanceof Promise?s.then(r=>er(r,e.out,i)):er(s,e.out,i)}});function er(n,e,t){return n.issues.length?(n.aborted=!0,n):e._zod.run({value:n.value,issues:n.issues},t)}const lm=Y("$ZodReadonly",(n,e)=>{Tt.init(n,e),nt(n._zod,"propValues",()=>e.innerType._zod.propValues),nt(n._zod,"values",()=>e.innerType._zod.values),nt(n._zod,"optin",()=>e.innerType?._zod?.optin),nt(n._zod,"optout",()=>e.innerType?._zod?.optout),n._zod.parse=(t,i)=>{if(i.direction==="backward")return e.innerType._zod.run(t,i);const s=e.innerType._zod.run(t,i);return s instanceof Promise?s.then(cl):cl(s)}});function cl(n){return n.value=Object.freeze(n.value),n}const um=Y("$ZodCustom",(n,e)=>{Yt.init(n,e),Tt.init(n,e),n._zod.parse=(t,i)=>t,n._zod.check=t=>{const i=t.value,s=e.fn(i);if(s instanceof Promise)return s.then(r=>ll(r,t,i,n));ll(s,t,i,n)}});function ll(n,e,t,i){if(!n){const s={code:"custom",input:t,inst:i,path:[...i._zod.def.path??[]],continue:!i._zod.def.abort};i._zod.def.params&&(s.params=i._zod.def.params),e.issues.push(Vs(s))}}var ul;class hm{constructor(){this._map=new WeakMap,this._idmap=new Map}add(e,...t){const i=t[0];return this._map.set(e,i),i&&typeof i=="object"&&"id"in i&&this._idmap.set(i.id,e),this}clear(){return this._map=new WeakMap,this._idmap=new Map,this}remove(e){const t=this._map.get(e);return t&&typeof t=="object"&&"id"in t&&this._idmap.delete(t.id),this._map.delete(e),this}get(e){const t=e._zod.parent;if(t){const i={...this.get(t)??{}};delete i.id;const s={...i,...this._map.get(e)};return Object.keys(s).length?s:void 0}return this._map.get(e)}has(e){return this._map.has(e)}}function dm(){return new hm}(ul=globalThis).__zod_globalRegistry??(ul.__zod_globalRegistry=dm());const Us=globalThis.__zod_globalRegistry;function fm(n,e){return new n({type:"string",...we(e)})}function pm(n,e){return new n({type:"string",format:"email",check:"string_format",abort:!1,...we(e)})}function hl(n,e){return new n({type:"string",format:"guid",check:"string_format",abort:!1,...we(e)})}function mm(n,e){return new n({type:"string",format:"uuid",check:"string_format",abort:!1,...we(e)})}function gm(n,e){return new n({type:"string",format:"uuid",check:"string_format",abort:!1,version:"v4",...we(e)})}function _m(n,e){return new n({type:"string",format:"uuid",check:"string_format",abort:!1,version:"v6",...we(e)})}function vm(n,e){return new n({type:"string",format:"uuid",check:"string_format",abort:!1,version:"v7",...we(e)})}function xm(n,e){return new n({type:"string",format:"url",check:"string_format",abort:!1,...we(e)})}function Mm(n,e){return new n({type:"string",format:"emoji",check:"string_format",abort:!1,...we(e)})}function Sm(n,e){return new n({type:"string",format:"nanoid",check:"string_format",abort:!1,...we(e)})}function ym(n,e){return new n({type:"string",format:"cuid",check:"string_format",abort:!1,...we(e)})}function bm(n,e){return new n({type:"string",format:"cuid2",check:"string_format",abort:!1,...we(e)})}function Em(n,e){return new n({type:"string",format:"ulid",check:"string_format",abort:!1,...we(e)})}function Tm(n,e){return new n({type:"string",format:"xid",check:"string_format",abort:!1,...we(e)})}function Am(n,e){return new n({type:"string",format:"ksuid",check:"string_format",abort:!1,...we(e)})}function wm(n,e){return new n({type:"string",format:"ipv4",check:"string_format",abort:!1,...we(e)})}function Rm(n,e){return new n({type:"string",format:"ipv6",check:"string_format",abort:!1,...we(e)})}function Cm(n,e){return new n({type:"string",format:"cidrv4",check:"string_format",abort:!1,...we(e)})}function Pm(n,e){return new n({type:"string",format:"cidrv6",check:"string_format",abort:!1,...we(e)})}function Im(n,e){return new n({type:"string",format:"base64",check:"string_format",abort:!1,...we(e)})}function Lm(n,e){return new n({type:"string",format:"base64url",check:"string_format",abort:!1,...we(e)})}function Nm(n,e){return new n({type:"string",format:"e164",check:"string_format",abort:!1,...we(e)})}function Dm(n,e){return new n({type:"string",format:"jwt",check:"string_format",abort:!1,...we(e)})}function Um(n,e){return new n({type:"string",format:"datetime",check:"string_format",offset:!1,local:!1,precision:null,...we(e)})}function Om(n,e){return new n({type:"string",format:"date",check:"string_format",...we(e)})}function Fm(n,e){return new n({type:"string",format:"time",check:"string_format",precision:null,...we(e)})}function zm(n,e){return new n({type:"string",format:"duration",check:"string_format",...we(e)})}function Bm(n,e){return new n({type:"number",checks:[],...we(e)})}function km(n,e){return new n({type:"number",check:"number_format",abort:!1,format:"safeint",...we(e)})}function Gm(n){return new n({type:"unknown"})}function Hm(n,e){return new n({type:"never",...we(e)})}function dl(n,e){return new Rh({check:"less_than",...we(e),value:n,inclusive:!1})}function fo(n,e){return new Rh({check:"less_than",...we(e),value:n,inclusive:!0})}function fl(n,e){return new Ch({check:"greater_than",...we(e),value:n,inclusive:!1})}function po(n,e){return new Ch({check:"greater_than",...we(e),value:n,inclusive:!0})}function pl(n,e){return new op({check:"multiple_of",...we(e),value:n})}function Uh(n,e){return new cp({check:"max_length",...we(e),maximum:n})}function Hr(n,e){return new lp({check:"min_length",...we(e),minimum:n})}function Oh(n,e){return new up({check:"length_equals",...we(e),length:n})}function Vm(n,e){return new hp({check:"string_format",format:"regex",...we(e),pattern:n})}function Wm(n){return new dp({check:"string_format",format:"lowercase",...we(n)})}function Xm(n){return new fp({check:"string_format",format:"uppercase",...we(n)})}function Zm(n,e){return new pp({check:"string_format",format:"includes",...we(e),includes:n})}function $m(n,e){return new mp({check:"string_format",format:"starts_with",...we(e),prefix:n})}function qm(n,e){return new gp({check:"string_format",format:"ends_with",...we(e),suffix:n})}function _s(n){return new _p({check:"overwrite",tx:n})}function jm(n){return _s(e=>e.normalize(n))}function Ym(){return _s(n=>n.trim())}function Km(){return _s(n=>n.toLowerCase())}function Jm(){return _s(n=>n.toUpperCase())}function Qm(){return _s(n=>hf(n))}function eg(n,e,t){return new n({type:"array",element:e,...we(t)})}function tg(n,e,t){return new n({type:"custom",check:"custom",fn:e,...we(t)})}function ng(n){const e=ig(t=>(t.addIssue=i=>{if(typeof i=="string")t.issues.push(Vs(i,t.value,e._zod.def));else{const s=i;s.fatal&&(s.continue=!1),s.code??(s.code="custom"),s.input??(s.input=t.value),s.inst??(s.inst=e),s.continue??(s.continue=!e._zod.def.abort),t.issues.push(Vs(s))}},n(t.value,t)));return e}function ig(n,e){const t=new Yt({check:"custom",...we(e)});return t._zod.check=n,t}function Fh(n){let e=n?.target??"draft-2020-12";return e==="draft-4"&&(e="draft-04"),e==="draft-7"&&(e="draft-07"),{processors:n.processors??{},metadataRegistry:n?.metadata??Us,target:e,unrepresentable:n?.unrepresentable??"throw",override:n?.override??(()=>{}),io:n?.io??"output",counter:0,seen:new Map,cycles:n?.cycles??"ref",reused:n?.reused??"inline",external:n?.external??void 0}}function Bt(n,e,t={path:[],schemaPath:[]}){var i;const s=n._zod.def,r=e.seen.get(n);if(r)return r.count++,t.schemaPath.includes(n)&&(r.cycle=t.path),r.schema;const o={schema:{},count:1,cycle:void 0,path:t.path};e.seen.set(n,o);const a=n._zod.toJSONSchema?.();if(a)o.schema=a;else{const u={...t,schemaPath:[...t.schemaPath,n],path:t.path};if(n._zod.processJSONSchema)n._zod.processJSONSchema(e,o.schema,u);else{const h=o.schema,f=e.processors[s.type];if(!f)throw new Error(`[toJSONSchema]: Non-representable type encountered: ${s.type}`);f(n,e,h,u)}const d=n._zod.parent;d&&(o.ref||(o.ref=d),Bt(d,e,u),e.seen.get(d).isParent=!0)}const c=e.metadataRegistry.get(n);return c&&Object.assign(o.schema,c),e.io==="input"&&Wt(n)&&(delete o.schema.examples,delete o.schema.default),e.io==="input"&&o.schema._prefault&&((i=o.schema).default??(i.default=o.schema._prefault)),delete o.schema._prefault,e.seen.get(n).schema}function zh(n,e){const t=n.seen.get(e);if(!t)throw new Error("Unprocessed schema. This is a bug in Zod.");const i=new Map;for(const o of n.seen.entries()){const a=n.metadataRegistry.get(o[0])?.id;if(a){const c=i.get(a);if(c&&c!==o[0])throw new Error(`Duplicate schema id "${a}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);i.set(a,o[0])}}const s=o=>{const a=n.target==="draft-2020-12"?"$defs":"definitions";if(n.external){const d=n.external.registry.get(o[0])?.id,h=n.external.uri??(g=>g);if(d)return{ref:h(d)};const f=o[1].defId??o[1].schema.id??`schema${n.counter++}`;return o[1].defId=f,{defId:f,ref:`${h("__shared")}#/${a}/${f}`}}if(o[1]===t)return{ref:"#"};const l=`#/${a}/`,u=o[1].schema.id??`__schema${n.counter++}`;return{defId:u,ref:l+u}},r=o=>{if(o[1].schema.$ref)return;const a=o[1],{ref:c,defId:l}=s(o);a.def={...a.schema},l&&(a.defId=l);const u=a.schema;for(const d in u)delete u[d];u.$ref=c};if(n.cycles==="throw")for(const o of n.seen.entries()){const a=o[1];if(a.cycle)throw new Error(`Cycle detected: #/${a.cycle?.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`)}for(const o of n.seen.entries()){const a=o[1];if(e===o[0]){r(o);continue}if(n.external){const l=n.external.registry.get(o[0])?.id;if(e!==o[0]&&l){r(o);continue}}if(n.metadataRegistry.get(o[0])?.id){r(o);continue}if(a.cycle){r(o);continue}if(a.count>1&&n.reused==="ref"){r(o);continue}}}function Bh(n,e){const t=n.seen.get(e);if(!t)throw new Error("Unprocessed schema. This is a bug in Zod.");const i=o=>{const a=n.seen.get(o);if(a.ref===null)return;const c=a.def??a.schema,l={...c},u=a.ref;if(a.ref=null,u){i(u);const h=n.seen.get(u),f=h.schema;if(f.$ref&&(n.target==="draft-07"||n.target==="draft-04"||n.target==="openapi-3.0")?(c.allOf=c.allOf??[],c.allOf.push(f)):Object.assign(c,f),Object.assign(c,l),o._zod.parent===u)for(const x in c)x==="$ref"||x==="allOf"||x in l||delete c[x];if(f.$ref&&h.def)for(const x in c)x==="$ref"||x==="allOf"||x in h.def&&JSON.stringify(c[x])===JSON.stringify(h.def[x])&&delete c[x]}const d=o._zod.parent;if(d&&d!==u){i(d);const h=n.seen.get(d);if(h?.schema.$ref&&(c.$ref=h.schema.$ref,h.def))for(const f in c)f==="$ref"||f==="allOf"||f in h.def&&JSON.stringify(c[f])===JSON.stringify(h.def[f])&&delete c[f]}n.override({zodSchema:o,jsonSchema:c,path:a.path??[]})};for(const o of[...n.seen.entries()].reverse())i(o[0]);const s={};if(n.target==="draft-2020-12"?s.$schema="https://json-schema.org/draft/2020-12/schema":n.target==="draft-07"?s.$schema="http://json-schema.org/draft-07/schema#":n.target==="draft-04"?s.$schema="http://json-schema.org/draft-04/schema#":n.target,n.external?.uri){const o=n.external.registry.get(e)?.id;if(!o)throw new Error("Schema is missing an `id` property");s.$id=n.external.uri(o)}Object.assign(s,t.def??t.schema);const r=n.external?.defs??{};for(const o of n.seen.entries()){const a=o[1];a.def&&a.defId&&(r[a.defId]=a.def)}n.external||Object.keys(r).length>0&&(n.target==="draft-2020-12"?s.$defs=r:s.definitions=r);try{const o=JSON.parse(JSON.stringify(s));return Object.defineProperty(o,"~standard",{value:{...e["~standard"],jsonSchema:{input:Vr(e,"input",n.processors),output:Vr(e,"output",n.processors)}},enumerable:!1,writable:!1}),o}catch{throw new Error("Error converting schema to JSON.")}}function Wt(n,e){const t=e??{seen:new Set};if(t.seen.has(n))return!1;t.seen.add(n);const i=n._zod.def;if(i.type==="transform")return!0;if(i.type==="array")return Wt(i.element,t);if(i.type==="set")return Wt(i.valueType,t);if(i.type==="lazy")return Wt(i.getter(),t);if(i.type==="promise"||i.type==="optional"||i.type==="nonoptional"||i.type==="nullable"||i.type==="readonly"||i.type==="default"||i.type==="prefault")return Wt(i.innerType,t);if(i.type==="intersection")return Wt(i.left,t)||Wt(i.right,t);if(i.type==="record"||i.type==="map")return Wt(i.keyType,t)||Wt(i.valueType,t);if(i.type==="pipe")return Wt(i.in,t)||Wt(i.out,t);if(i.type==="object"){for(const s in i.shape)if(Wt(i.shape[s],t))return!0;return!1}if(i.type==="union"){for(const s of i.options)if(Wt(s,t))return!0;return!1}if(i.type==="tuple"){for(const s of i.items)if(Wt(s,t))return!0;return!!(i.rest&&Wt(i.rest,t))}return!1}const sg=(n,e={})=>t=>{const i=Fh({...t,processors:e});return Bt(n,i),zh(i,n),Bh(i,n)},Vr=(n,e,t={})=>i=>{const{libraryOptions:s,target:r}=i??{},o=Fh({...s??{},target:r,io:e,processors:t});return Bt(n,o),zh(o,n),Bh(o,n)},rg={guid:"uuid",url:"uri",datetime:"date-time",json_string:"json-string",regex:""},og=(n,e,t,i)=>{const s=t;s.type="string";const{minimum:r,maximum:o,format:a,patterns:c,contentEncoding:l}=n._zod.bag;if(typeof r=="number"&&(s.minLength=r),typeof o=="number"&&(s.maxLength=o),a&&(s.format=rg[a]??a,s.format===""&&delete s.format,a==="time"&&delete s.format),l&&(s.contentEncoding=l),c&&c.size>0){const u=[...c];u.length===1?s.pattern=u[0].source:u.length>1&&(s.allOf=[...u.map(d=>({...e.target==="draft-07"||e.target==="draft-04"||e.target==="openapi-3.0"?{type:"string"}:{},pattern:d.source}))])}},ag=(n,e,t,i)=>{const s=t,{minimum:r,maximum:o,format:a,multipleOf:c,exclusiveMaximum:l,exclusiveMinimum:u}=n._zod.bag;typeof a=="string"&&a.includes("int")?s.type="integer":s.type="number",typeof u=="number"&&(e.target==="draft-04"||e.target==="openapi-3.0"?(s.minimum=u,s.exclusiveMinimum=!0):s.exclusiveMinimum=u),typeof r=="number"&&(s.minimum=r,typeof u=="number"&&e.target!=="draft-04"&&(u>=r?delete s.minimum:delete s.exclusiveMinimum)),typeof l=="number"&&(e.target==="draft-04"||e.target==="openapi-3.0"?(s.maximum=l,s.exclusiveMaximum=!0):s.exclusiveMaximum=l),typeof o=="number"&&(s.maximum=o,typeof l=="number"&&e.target!=="draft-04"&&(l<=o?delete s.maximum:delete s.exclusiveMaximum)),typeof c=="number"&&(s.multipleOf=c)},cg=(n,e,t,i)=>{t.not={}},lg=(n,e,t,i)=>{},ug=(n,e,t,i)=>{const s=n._zod.def,r=_h(s.entries);r.every(o=>typeof o=="number")&&(t.type="number"),r.every(o=>typeof o=="string")&&(t.type="string"),t.enum=r},hg=(n,e,t,i)=>{const s=n._zod.def,r=[];for(const o of s.values)if(o===void 0){if(e.unrepresentable==="throw")throw new Error("Literal `undefined` cannot be represented in JSON Schema")}else if(typeof o=="bigint"){if(e.unrepresentable==="throw")throw new Error("BigInt literals cannot be represented in JSON Schema");r.push(Number(o))}else r.push(o);if(r.length!==0)if(r.length===1){const o=r[0];t.type=o===null?"null":typeof o,e.target==="draft-04"||e.target==="openapi-3.0"?t.enum=[o]:t.const=o}else r.every(o=>typeof o=="number")&&(t.type="number"),r.every(o=>typeof o=="string")&&(t.type="string"),r.every(o=>typeof o=="boolean")&&(t.type="boolean"),r.every(o=>o===null)&&(t.type="null"),t.enum=r},dg=(n,e,t,i)=>{if(e.unrepresentable==="throw")throw new Error("Custom types cannot be represented in JSON Schema")},fg=(n,e,t,i)=>{if(e.unrepresentable==="throw")throw new Error("Transforms cannot be represented in JSON Schema")},pg=(n,e,t,i)=>{const s=t,r=n._zod.def,{minimum:o,maximum:a}=n._zod.bag;typeof o=="number"&&(s.minItems=o),typeof a=="number"&&(s.maxItems=a),s.type="array",s.items=Bt(r.element,e,{...i,path:[...i.path,"items"]})},mg=(n,e,t,i)=>{const s=t,r=n._zod.def;s.type="object",s.properties={};const o=r.shape;for(const l in o)s.properties[l]=Bt(o[l],e,{...i,path:[...i.path,"properties",l]});const a=new Set(Object.keys(o)),c=new Set([...a].filter(l=>{const u=r.shape[l]._zod;return e.io==="input"?u.optin===void 0:u.optout===void 0}));c.size>0&&(s.required=Array.from(c)),r.catchall?._zod.def.type==="never"?s.additionalProperties=!1:r.catchall?r.catchall&&(s.additionalProperties=Bt(r.catchall,e,{...i,path:[...i.path,"additionalProperties"]})):e.io==="output"&&(s.additionalProperties=!1)},gg=(n,e,t,i)=>{const s=n._zod.def,r=s.inclusive===!1,o=s.options.map((a,c)=>Bt(a,e,{...i,path:[...i.path,r?"oneOf":"anyOf",c]}));r?t.oneOf=o:t.anyOf=o},_g=(n,e,t,i)=>{const s=n._zod.def,r=Bt(s.left,e,{...i,path:[...i.path,"allOf",0]}),o=Bt(s.right,e,{...i,path:[...i.path,"allOf",1]}),a=l=>"allOf"in l&&Object.keys(l).length===1,c=[...a(r)?r.allOf:[r],...a(o)?o.allOf:[o]];t.allOf=c},vg=(n,e,t,i)=>{const s=n._zod.def,r=Bt(s.innerType,e,i),o=e.seen.get(n);e.target==="openapi-3.0"?(o.ref=s.innerType,t.nullable=!0):t.anyOf=[r,{type:"null"}]},xg=(n,e,t,i)=>{const s=n._zod.def;Bt(s.innerType,e,i);const r=e.seen.get(n);r.ref=s.innerType},Mg=(n,e,t,i)=>{const s=n._zod.def;Bt(s.innerType,e,i);const r=e.seen.get(n);r.ref=s.innerType,t.default=JSON.parse(JSON.stringify(s.defaultValue))},Sg=(n,e,t,i)=>{const s=n._zod.def;Bt(s.innerType,e,i);const r=e.seen.get(n);r.ref=s.innerType,e.io==="input"&&(t._prefault=JSON.parse(JSON.stringify(s.defaultValue)))},yg=(n,e,t,i)=>{const s=n._zod.def;Bt(s.innerType,e,i);const r=e.seen.get(n);r.ref=s.innerType;let o;try{o=s.catchValue(void 0)}catch{throw new Error("Dynamic catch values are not supported in JSON Schema")}t.default=o},bg=(n,e,t,i)=>{const s=n._zod.def,r=e.io==="input"?s.in._zod.def.type==="transform"?s.out:s.in:s.out;Bt(r,e,i);const o=e.seen.get(n);o.ref=r},Eg=(n,e,t,i)=>{const s=n._zod.def;Bt(s.innerType,e,i);const r=e.seen.get(n);r.ref=s.innerType,t.readOnly=!0},kh=(n,e,t,i)=>{const s=n._zod.def;Bt(s.innerType,e,i);const r=e.seen.get(n);r.ref=s.innerType},Tg=Y("ZodISODateTime",(n,e)=>{Ip.init(n,e),_t.init(n,e)});function Ag(n){return Um(Tg,n)}const wg=Y("ZodISODate",(n,e)=>{Lp.init(n,e),_t.init(n,e)});function Rg(n){return Om(wg,n)}const Cg=Y("ZodISOTime",(n,e)=>{Np.init(n,e),_t.init(n,e)});function Pg(n){return Fm(Cg,n)}const Ig=Y("ZodISODuration",(n,e)=>{Dp.init(n,e),_t.init(n,e)});function Lg(n){return zm(Ig,n)}const Ng=(n,e)=>{yh.init(n,e),n.name="ZodError",Object.defineProperties(n,{format:{value:t=>Ef(n,t)},flatten:{value:t=>bf(n,t)},addIssue:{value:t=>{n.issues.push(t),n.message=JSON.stringify(n.issues,ma,2)}},addIssues:{value:t=>{n.issues.push(...t),n.message=JSON.stringify(n.issues,ma,2)}},isEmpty:{get(){return n.issues.length===0}}})},hn=Y("ZodError",Ng,{Parent:Error}),Dg=vc(hn),Ug=xc(hn),Og=eo(hn),Fg=to(hn),zg=wf(hn),Bg=Rf(hn),kg=Cf(hn),Gg=Pf(hn),Hg=If(hn),Vg=Lf(hn),Wg=Nf(hn),Xg=Df(hn),At=Y("ZodType",(n,e)=>(Tt.init(n,e),Object.assign(n["~standard"],{jsonSchema:{input:Vr(n,"input"),output:Vr(n,"output")}}),n.toJSONSchema=sg(n,{}),n.def=e,n.type=e.type,Object.defineProperty(n,"_def",{value:e}),n.check=(...t)=>n.clone(hi(e,{checks:[...e.checks??[],...t.map(i=>typeof i=="function"?{_zod:{check:i,def:{check:"custom"},onattach:[]}}:i)]}),{parent:!0}),n.with=n.check,n.clone=(t,i)=>di(n,t,i),n.brand=()=>n,n.register=(t,i)=>(t.add(n,i),n),n.parse=(t,i)=>Dg(n,t,i,{callee:n.parse}),n.safeParse=(t,i)=>Og(n,t,i),n.parseAsync=async(t,i)=>Ug(n,t,i,{callee:n.parseAsync}),n.safeParseAsync=async(t,i)=>Fg(n,t,i),n.spa=n.safeParseAsync,n.encode=(t,i)=>zg(n,t,i),n.decode=(t,i)=>Bg(n,t,i),n.encodeAsync=async(t,i)=>kg(n,t,i),n.decodeAsync=async(t,i)=>Gg(n,t,i),n.safeEncode=(t,i)=>Hg(n,t,i),n.safeDecode=(t,i)=>Vg(n,t,i),n.safeEncodeAsync=async(t,i)=>Wg(n,t,i),n.safeDecodeAsync=async(t,i)=>Xg(n,t,i),n.refine=(t,i)=>n.check(F_(t,i)),n.superRefine=t=>n.check(z_(t)),n.overwrite=t=>n.check(_s(t)),n.optional=()=>xl(n),n.exactOptional=()=>E_(n),n.nullable=()=>Ml(n),n.nullish=()=>xl(Ml(n)),n.nonoptional=t=>P_(n,t),n.array=()=>Sc(n),n.or=t=>Wh([n,t]),n.and=t=>x_(n,t),n.transform=t=>Sl(n,y_(t)),n.default=t=>w_(n,t),n.prefault=t=>C_(n,t),n.catch=t=>L_(n,t),n.pipe=t=>Sl(n,t),n.readonly=()=>U_(n),n.describe=t=>{const i=n.clone();return Us.add(i,{description:t}),i},Object.defineProperty(n,"description",{get(){return Us.get(n)?.description},configurable:!0}),n.meta=(...t)=>{if(t.length===0)return Us.get(n);const i=n.clone();return Us.add(i,t[0]),i},n.isOptional=()=>n.safeParse(void 0).success,n.isNullable=()=>n.safeParse(null).success,n.apply=t=>t(n),n)),Gh=Y("_ZodString",(n,e)=>{Mc.init(n,e),At.init(n,e),n._zod.processJSONSchema=(i,s,r)=>og(n,i,s);const t=n._zod.bag;n.format=t.format??null,n.minLength=t.minimum??null,n.maxLength=t.maximum??null,n.regex=(...i)=>n.check(Vm(...i)),n.includes=(...i)=>n.check(Zm(...i)),n.startsWith=(...i)=>n.check($m(...i)),n.endsWith=(...i)=>n.check(qm(...i)),n.min=(...i)=>n.check(Hr(...i)),n.max=(...i)=>n.check(Uh(...i)),n.length=(...i)=>n.check(Oh(...i)),n.nonempty=(...i)=>n.check(Hr(1,...i)),n.lowercase=i=>n.check(Wm(i)),n.uppercase=i=>n.check(Xm(i)),n.trim=()=>n.check(Ym()),n.normalize=(...i)=>n.check(jm(...i)),n.toLowerCase=()=>n.check(Km()),n.toUpperCase=()=>n.check(Jm()),n.slugify=()=>n.check(Qm())}),Zg=Y("ZodString",(n,e)=>{Mc.init(n,e),Gh.init(n,e),n.email=t=>n.check(pm($g,t)),n.url=t=>n.check(xm(qg,t)),n.jwt=t=>n.check(Dm(l_,t)),n.emoji=t=>n.check(Mm(jg,t)),n.guid=t=>n.check(hl(ml,t)),n.uuid=t=>n.check(mm(tr,t)),n.uuidv4=t=>n.check(gm(tr,t)),n.uuidv6=t=>n.check(_m(tr,t)),n.uuidv7=t=>n.check(vm(tr,t)),n.nanoid=t=>n.check(Sm(Yg,t)),n.guid=t=>n.check(hl(ml,t)),n.cuid=t=>n.check(ym(Kg,t)),n.cuid2=t=>n.check(bm(Jg,t)),n.ulid=t=>n.check(Em(Qg,t)),n.base64=t=>n.check(Im(o_,t)),n.base64url=t=>n.check(Lm(a_,t)),n.xid=t=>n.check(Tm(e_,t)),n.ksuid=t=>n.check(Am(t_,t)),n.ipv4=t=>n.check(wm(n_,t)),n.ipv6=t=>n.check(Rm(i_,t)),n.cidrv4=t=>n.check(Cm(s_,t)),n.cidrv6=t=>n.check(Pm(r_,t)),n.e164=t=>n.check(Nm(c_,t)),n.datetime=t=>n.check(Ag(t)),n.date=t=>n.check(Rg(t)),n.time=t=>n.check(Pg(t)),n.duration=t=>n.check(Lg(t))});function mo(n){return fm(Zg,n)}const _t=Y("ZodStringFormat",(n,e)=>{pt.init(n,e),Gh.init(n,e)}),$g=Y("ZodEmail",(n,e)=>{yp.init(n,e),_t.init(n,e)}),ml=Y("ZodGUID",(n,e)=>{Mp.init(n,e),_t.init(n,e)}),tr=Y("ZodUUID",(n,e)=>{Sp.init(n,e),_t.init(n,e)}),qg=Y("ZodURL",(n,e)=>{bp.init(n,e),_t.init(n,e)}),jg=Y("ZodEmoji",(n,e)=>{Ep.init(n,e),_t.init(n,e)}),Yg=Y("ZodNanoID",(n,e)=>{Tp.init(n,e),_t.init(n,e)}),Kg=Y("ZodCUID",(n,e)=>{Ap.init(n,e),_t.init(n,e)}),Jg=Y("ZodCUID2",(n,e)=>{wp.init(n,e),_t.init(n,e)}),Qg=Y("ZodULID",(n,e)=>{Rp.init(n,e),_t.init(n,e)}),e_=Y("ZodXID",(n,e)=>{Cp.init(n,e),_t.init(n,e)}),t_=Y("ZodKSUID",(n,e)=>{Pp.init(n,e),_t.init(n,e)}),n_=Y("ZodIPv4",(n,e)=>{Up.init(n,e),_t.init(n,e)}),i_=Y("ZodIPv6",(n,e)=>{Op.init(n,e),_t.init(n,e)}),s_=Y("ZodCIDRv4",(n,e)=>{Fp.init(n,e),_t.init(n,e)}),r_=Y("ZodCIDRv6",(n,e)=>{zp.init(n,e),_t.init(n,e)}),o_=Y("ZodBase64",(n,e)=>{Bp.init(n,e),_t.init(n,e)}),a_=Y("ZodBase64URL",(n,e)=>{Gp.init(n,e),_t.init(n,e)}),c_=Y("ZodE164",(n,e)=>{Hp.init(n,e),_t.init(n,e)}),l_=Y("ZodJWT",(n,e)=>{Wp.init(n,e),_t.init(n,e)}),Hh=Y("ZodNumber",(n,e)=>{Ih.init(n,e),At.init(n,e),n._zod.processJSONSchema=(i,s,r)=>ag(n,i,s),n.gt=(i,s)=>n.check(fl(i,s)),n.gte=(i,s)=>n.check(po(i,s)),n.min=(i,s)=>n.check(po(i,s)),n.lt=(i,s)=>n.check(dl(i,s)),n.lte=(i,s)=>n.check(fo(i,s)),n.max=(i,s)=>n.check(fo(i,s)),n.int=i=>n.check(gl(i)),n.safe=i=>n.check(gl(i)),n.positive=i=>n.check(fl(0,i)),n.nonnegative=i=>n.check(po(0,i)),n.negative=i=>n.check(dl(0,i)),n.nonpositive=i=>n.check(fo(0,i)),n.multipleOf=(i,s)=>n.check(pl(i,s)),n.step=(i,s)=>n.check(pl(i,s)),n.finite=()=>n;const t=n._zod.bag;n.minValue=Math.max(t.minimum??Number.NEGATIVE_INFINITY,t.exclusiveMinimum??Number.NEGATIVE_INFINITY)??null,n.maxValue=Math.min(t.maximum??Number.POSITIVE_INFINITY,t.exclusiveMaximum??Number.POSITIVE_INFINITY)??null,n.isInt=(t.format??"").includes("int")||Number.isSafeInteger(t.multipleOf??.5),n.isFinite=!0,n.format=t.format??null});function u_(n){return Bm(Hh,n)}const h_=Y("ZodNumberFormat",(n,e)=>{Xp.init(n,e),Hh.init(n,e)});function gl(n){return km(h_,n)}const d_=Y("ZodUnknown",(n,e)=>{Zp.init(n,e),At.init(n,e),n._zod.processJSONSchema=(t,i,s)=>lg()});function _l(){return Gm(d_)}const f_=Y("ZodNever",(n,e)=>{$p.init(n,e),At.init(n,e),n._zod.processJSONSchema=(t,i,s)=>cg(n,t,i)});function p_(n){return Hm(f_,n)}const m_=Y("ZodArray",(n,e)=>{qp.init(n,e),At.init(n,e),n._zod.processJSONSchema=(t,i,s)=>pg(n,t,i,s),n.element=e.element,n.min=(t,i)=>n.check(Hr(t,i)),n.nonempty=t=>n.check(Hr(1,t)),n.max=(t,i)=>n.check(Uh(t,i)),n.length=(t,i)=>n.check(Oh(t,i)),n.unwrap=()=>n.element});function Sc(n,e){return eg(m_,n,e)}const g_=Y("ZodObject",(n,e)=>{Yp.init(n,e),At.init(n,e),n._zod.processJSONSchema=(t,i,s)=>mg(n,t,i,s),nt(n,"shape",()=>e.shape),n.keyof=()=>yc(Object.keys(n._zod.def.shape)),n.catchall=t=>n.clone({...n._zod.def,catchall:t}),n.passthrough=()=>n.clone({...n._zod.def,catchall:_l()}),n.loose=()=>n.clone({...n._zod.def,catchall:_l()}),n.strict=()=>n.clone({...n._zod.def,catchall:p_()}),n.strip=()=>n.clone({...n._zod.def,catchall:void 0}),n.extend=t=>vf(n,t),n.safeExtend=t=>xf(n,t),n.merge=t=>Mf(n,t),n.pick=t=>gf(n,t),n.omit=t=>_f(n,t),n.partial=(...t)=>Sf(Xh,n,t[0]),n.required=(...t)=>yf(Zh,n,t[0])});function Vh(n,e){const t={type:"object",shape:n??{},...we(e)};return new g_(t)}const __=Y("ZodUnion",(n,e)=>{Kp.init(n,e),At.init(n,e),n._zod.processJSONSchema=(t,i,s)=>gg(n,t,i,s),n.options=e.options});function Wh(n,e){return new __({type:"union",options:n,...we(e)})}const v_=Y("ZodIntersection",(n,e)=>{Jp.init(n,e),At.init(n,e),n._zod.processJSONSchema=(t,i,s)=>_g(n,t,i,s)});function x_(n,e){return new v_({type:"intersection",left:n,right:e})}const _a=Y("ZodEnum",(n,e)=>{Qp.init(n,e),At.init(n,e),n._zod.processJSONSchema=(i,s,r)=>ug(n,i,s),n.enum=e.entries,n.options=Object.values(e.entries);const t=new Set(Object.keys(e.entries));n.extract=(i,s)=>{const r={};for(const o of i)if(t.has(o))r[o]=e.entries[o];else throw new Error(`Key ${o} not found in enum`);return new _a({...e,checks:[],...we(s),entries:r})},n.exclude=(i,s)=>{const r={...e.entries};for(const o of i)if(t.has(o))delete r[o];else throw new Error(`Key ${o} not found in enum`);return new _a({...e,checks:[],...we(s),entries:r})}});function yc(n,e){const t=Array.isArray(n)?Object.fromEntries(n.map(i=>[i,i])):n;return new _a({type:"enum",entries:t,...we(e)})}const M_=Y("ZodLiteral",(n,e)=>{em.init(n,e),At.init(n,e),n._zod.processJSONSchema=(t,i,s)=>hg(n,t,i),n.values=new Set(e.values),Object.defineProperty(n,"value",{get(){if(e.values.length>1)throw new Error("This schema contains multiple valid literal values. Use `.values` instead.");return e.values[0]}})});function vl(n,e){return new M_({type:"literal",values:Array.isArray(n)?n:[n],...we(e)})}const S_=Y("ZodTransform",(n,e)=>{tm.init(n,e),At.init(n,e),n._zod.processJSONSchema=(t,i,s)=>fg(n,t),n._zod.parse=(t,i)=>{if(i.direction==="backward")throw new mh(n.constructor.name);t.addIssue=r=>{if(typeof r=="string")t.issues.push(Vs(r,t.value,e));else{const o=r;o.fatal&&(o.continue=!1),o.code??(o.code="custom"),o.input??(o.input=t.value),o.inst??(o.inst=n),t.issues.push(Vs(o))}};const s=e.transform(t.value,t);return s instanceof Promise?s.then(r=>(t.value=r,t)):(t.value=s,t)}});function y_(n){return new S_({type:"transform",transform:n})}const Xh=Y("ZodOptional",(n,e)=>{Dh.init(n,e),At.init(n,e),n._zod.processJSONSchema=(t,i,s)=>kh(n,t,i,s),n.unwrap=()=>n._zod.def.innerType});function xl(n){return new Xh({type:"optional",innerType:n})}const b_=Y("ZodExactOptional",(n,e)=>{nm.init(n,e),At.init(n,e),n._zod.processJSONSchema=(t,i,s)=>kh(n,t,i,s),n.unwrap=()=>n._zod.def.innerType});function E_(n){return new b_({type:"optional",innerType:n})}const T_=Y("ZodNullable",(n,e)=>{im.init(n,e),At.init(n,e),n._zod.processJSONSchema=(t,i,s)=>vg(n,t,i,s),n.unwrap=()=>n._zod.def.innerType});function Ml(n){return new T_({type:"nullable",innerType:n})}const A_=Y("ZodDefault",(n,e)=>{sm.init(n,e),At.init(n,e),n._zod.processJSONSchema=(t,i,s)=>Mg(n,t,i,s),n.unwrap=()=>n._zod.def.innerType,n.removeDefault=n.unwrap});function w_(n,e){return new A_({type:"default",innerType:n,get defaultValue(){return typeof e=="function"?e():xh(e)}})}const R_=Y("ZodPrefault",(n,e)=>{rm.init(n,e),At.init(n,e),n._zod.processJSONSchema=(t,i,s)=>Sg(n,t,i,s),n.unwrap=()=>n._zod.def.innerType});function C_(n,e){return new R_({type:"prefault",innerType:n,get defaultValue(){return typeof e=="function"?e():xh(e)}})}const Zh=Y("ZodNonOptional",(n,e)=>{om.init(n,e),At.init(n,e),n._zod.processJSONSchema=(t,i,s)=>xg(n,t,i,s),n.unwrap=()=>n._zod.def.innerType});function P_(n,e){return new Zh({type:"nonoptional",innerType:n,...we(e)})}const I_=Y("ZodCatch",(n,e)=>{am.init(n,e),At.init(n,e),n._zod.processJSONSchema=(t,i,s)=>yg(n,t,i,s),n.unwrap=()=>n._zod.def.innerType,n.removeCatch=n.unwrap});function L_(n,e){return new I_({type:"catch",innerType:n,catchValue:typeof e=="function"?e:()=>e})}const N_=Y("ZodPipe",(n,e)=>{cm.init(n,e),At.init(n,e),n._zod.processJSONSchema=(t,i,s)=>bg(n,t,i,s),n.in=e.in,n.out=e.out});function Sl(n,e){return new N_({type:"pipe",in:n,out:e})}const D_=Y("ZodReadonly",(n,e)=>{lm.init(n,e),At.init(n,e),n._zod.processJSONSchema=(t,i,s)=>Eg(n,t,i,s),n.unwrap=()=>n._zod.def.innerType});function U_(n){return new D_({type:"readonly",innerType:n})}const O_=Y("ZodCustom",(n,e)=>{um.init(n,e),At.init(n,e),n._zod.processJSONSchema=(t,i,s)=>dg(n,t)});function F_(n,e={}){return tg(O_,n,e)}function z_(n){return ng(n)}const B_=yc(["circulatory","respiratory","digestive","skeletal","muscular","nervous","cells","general"]),k_=yc(["multiple_choice","true_false"]),G_=Wh([vl(1),vl(2)]).default(1),H_=Vh({id:mo().min(1),system:B_,level:G_,type:k_,prompt:mo().min(1),answers:Sc(mo().min(1)).min(2).max(4),correctIndex:u_().int().nonnegative()}).refine(n=>n.correctIndex<n.answers.length,{message:"correctIndex must be a valid index into answers",path:["correctIndex"]}),V_=Vh({questions:Sc(H_).min(1)}).refine(n=>{const e=n.questions.map(t=>t.id);return new Set(e).size===e.length},{message:"Question ids must be unique"});class W_ extends Error{constructor(e,t){super(e),this.cause=t,this.name="ContentValidationError"}}function X_(n){const e=V_.safeParse(n);if(!e.success)throw new W_(`Invalid questions content: ${e.error.issues.map(t=>t.message).join("; ")}`,e.error);return e.data}async function Z_(){const n=await lf(()=>import("./questions-DOrIceL3.js"),[]);return X_(n.default??n)}function $h(n){let e=n>>>0;return()=>{e=e+1831565813>>>0;let t=e;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}}function $_(n,e){const t=[...n],i=$h(e);for(let s=t.length-1;s>0;s--){const r=Math.floor(i()*(s+1));[t[s],t[r]]=[t[r],t[s]]}return t}function q_(n){if(n.length===0)throw new Error("RunBuilder: question pool is empty")}function j_(n){if(!Number.isFinite(n)||n<=0)throw new Error(`RunBuilder: count must be a positive number, got ${n}`)}function Y_(n,e){q_(n),j_(e);const t=Math.random()*4294967295>>>0,i=$_(n,t);return i.slice(0,Math.min(e,i.length))}const yl="psg.streak",bl="psg.settings",El="psg.lastDailyResult",K_={questionCount:10,musicMuted:!1,sfxMuted:!1},J_={current:0,lastCompletedDate:null};function go(n){try{return localStorage.getItem(n)}catch{return null}}function _o(n,e){try{localStorage.setItem(n,e)}catch{}}function vo(n,e){if(n===null)return e;try{return JSON.parse(n)}catch{return e}}class Q_{getStreak(){return vo(go(yl),J_)}setStreak(e){_o(yl,JSON.stringify(e))}getSettings(){return{...K_,...vo(go(bl),{})}}setSettings(e){_o(bl,JSON.stringify(e))}getLastDailyResult(){return vo(go(El),null)}setLastDailyResult(e){_o(El,JSON.stringify(e))}}function e0(n,e){const[t,i,s]=n.split("-").map(Number),[r,o,a]=e.split("-").map(Number),c=Date.UTC(t,i-1,s),l=Date.UTC(r,o-1,a);return Math.round((l-c)/864e5)}function t0(n,e){const t=n.getStreak();if(t.lastCompletedDate===e)return;if(t.lastCompletedDate===null){n.setStreak({current:1,lastCompletedDate:e});return}e0(t.lastCompletedDate,e)===1?n.setStreak({current:t.current+1,lastCompletedDate:e}):n.setStreak({current:1,lastCompletedDate:e})}class n0{listeners={};on(e,t){let i=this.listeners[e];return i||(i=new Set,this.listeners[e]=i),i.add(t),()=>i.delete(t)}emit(e,t){const i=this.listeners[e];if(i)for(const s of i)s(t)}}class i0{events=new n0;_phase="Idle";_cups=0;_queue=[];_firstAttemptIds=new Set;_firstAttemptCorrect=0;_totalQuestions=0;_mode="practice";_dateYmd=null;get phase(){return this._phase}get cups(){return this._cups}get currentQuestion(){return this._phase==="AtGate"?this._queue[0]??null:null}get remainingQuestions(){return this._queue.length}get firstAttemptCorrect(){return this._firstAttemptCorrect}get totalQuestions(){return this._totalQuestions}peekNextQuestion(){return this._queue[0]??null}startRun(e,t){if(e.length===0)throw new Error("GameState.startRun: queue is empty");this._queue=[...e],this._cups=0,this._firstAttemptIds=new Set,this._firstAttemptCorrect=0,this._totalQuestions=e.length,this._mode=t.mode,this._dateYmd=t.dateYmd??null,this.transition("Running")}approachGate(){if(this._phase!=="Running")throw new Error(`GameState.approachGate: cannot transition from ${this._phase}`);if(this._queue.length===0)throw new Error("GameState.approachGate: no questions remain");this.transition("AtGate")}resolveAnswer(e){if(this._phase!=="AtGate")throw new Error(`GameState.resolveAnswer: cannot transition from ${this._phase}`);const t=this._queue.shift();this.transition("Resolving");const i=e===t.correctIndex,s=!this._firstAttemptIds.has(t.id);if(this._firstAttemptIds.add(t.id),i)this._cups=Math.max(this._cups*2,1),s&&(this._firstAttemptCorrect+=1),this.events.emit("cupsChanged",{cups:this._cups});else{const r=this._cups,o=Math.floor(r/2),a=r-o;a>0&&this.events.emit("wrongAnswerSplash",{lost:a}),this._cups=o,this._queue.push(t),this.events.emit("cupsChanged",{cups:this._cups})}this.events.emit("questionResolved",{questionId:t.id,correct:i,firstAttempt:s}),this._queue.length===0?this.transition("Finishing"):this.transition("Running")}collectCup(){this._phase!=="Running"&&this._phase!=="AtGate"||(this._cups+=1,this.events.emit("cupsChanged",{cups:this._cups}))}hitObstacle(e){this._phase!=="Running"&&this._phase!=="AtGate"||(this._cups=Math.max(0,this._cups-e),this.events.emit("cupsChanged",{cups:this._cups}))}completeFinish(){if(this._phase!=="Finishing")throw new Error(`GameState.completeFinish: cannot transition from ${this._phase}`);this.transition("Complete")}getResult(){if(this._phase!=="Complete"&&this._phase!=="Finishing")throw new Error(`GameState.getResult: not available in phase ${this._phase}`);const e=this._totalQuestions===0?0:this._firstAttemptCorrect/this._totalQuestions;return{mode:this._mode,cups:this._cups,firstAttemptCorrect:this._firstAttemptCorrect,totalQuestions:this._totalQuestions,accuracy:e,perfect:e===1,dateYmd:this._dateYmd}}transition(e){const t=this._phase;this._phase=e,this.events.emit("phaseChanged",{from:t,to:e})}}/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const bc="184",s0=0,Tl=1,r0=2,Lr=1,o0=2,Os=3,Xn=0,jt=1,Ft=2,Vn=0,rs=1,Al=2,wl=3,Rl=4,a0=5,Mi=100,c0=101,l0=102,u0=103,h0=104,d0=200,f0=201,p0=202,m0=203,va=204,xa=205,g0=206,_0=207,v0=208,x0=209,M0=210,S0=211,y0=212,b0=213,E0=214,Ma=0,Sa=1,ya=2,ls=3,ba=4,Ea=5,Ta=6,Aa=7,qh=0,T0=1,A0=2,wn=0,jh=1,Yh=2,Kh=3,Jh=4,Qh=5,ed=6,td=7,Cl="attached",w0="detached",nd=300,wi=301,us=302,xo=303,Mo=304,io=306,li=1e3,Tn=1001,Wr=1002,It=1003,id=1004,Fs=1005,Lt=1006,Nr=1007,Gn=1008,tn=1009,sd=1010,rd=1011,Ws=1012,Ec=1013,Pn=1014,ln=1015,Zn=1016,Tc=1017,Ac=1018,Xs=1020,od=35902,ad=35899,cd=1021,ld=1022,un=1023,$n=1026,bi=1027,wc=1028,Rc=1029,Ri=1030,Cc=1031,Pc=1033,Dr=33776,Ur=33777,Or=33778,Fr=33779,wa=35840,Ra=35841,Ca=35842,Pa=35843,Ia=36196,La=37492,Na=37496,Da=37488,Ua=37489,Xr=37490,Oa=37491,Fa=37808,za=37809,Ba=37810,ka=37811,Ga=37812,Ha=37813,Va=37814,Wa=37815,Xa=37816,Za=37817,$a=37818,qa=37819,ja=37820,Ya=37821,Ka=36492,Ja=36494,Qa=36495,ec=36283,tc=36284,Zr=36285,nc=36286,Zs=2300,$s=2301,So=2302,Pl=2303,Il=2400,Ll=2401,Nl=2402,R0=2500,C0=0,ud=1,ic=2,P0=3200,sc=0,I0=1,oi="",bt="srgb",sn="srgb-linear",$r="linear",Qe="srgb",Di=7680,Dl=519,L0=512,N0=513,D0=514,Ic=515,U0=516,O0=517,Lc=518,F0=519,rc=35044,Ul="300 es",An=2e3,qs=2001;function z0(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function B0(n){return ArrayBuffer.isView(n)&&!(n instanceof DataView)}function js(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function k0(){const n=js("canvas");return n.style.display="block",n}const Ol={};function qr(...n){const e="THREE."+n.shift();console.log(e,...n)}function hd(n){const e=n[0];if(typeof e=="string"&&e.startsWith("TSL:")){const t=n[1];t&&t.isStackTrace?n[0]+=" "+t.getLocation():n[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return n}function be(...n){n=hd(n);const e="THREE."+n.shift();{const t=n[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...n)}}function Pe(...n){n=hd(n);const e="THREE."+n.shift();{const t=n[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...n)}}function oc(...n){const e=n.join(" ");e in Ol||(Ol[e]=!0,be(...n))}function G0(n,e,t){return new Promise(function(i,s){function r(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:i()}}setTimeout(r,t)})}const H0={[Ma]:Sa,[ya]:Ta,[ba]:Aa,[ls]:Ea,[Sa]:Ma,[Ta]:ya,[Aa]:ba,[Ea]:ls};class Pi{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){const i=this._listeners;if(i===void 0)return;const s=i[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const i=t[e.type];if(i!==void 0){e.target=this;const s=i.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,e);e.target=null}}}const Gt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Fl=1234567;const Bs=Math.PI/180,hs=180/Math.PI;function _n(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Gt[n&255]+Gt[n>>8&255]+Gt[n>>16&255]+Gt[n>>24&255]+"-"+Gt[e&255]+Gt[e>>8&255]+"-"+Gt[e>>16&15|64]+Gt[e>>24&255]+"-"+Gt[t&63|128]+Gt[t>>8&255]+"-"+Gt[t>>16&255]+Gt[t>>24&255]+Gt[i&255]+Gt[i>>8&255]+Gt[i>>16&255]+Gt[i>>24&255]).toLowerCase()}function $e(n,e,t){return Math.max(e,Math.min(t,n))}function Nc(n,e){return(n%e+e)%e}function V0(n,e,t,i,s){return i+(n-e)*(s-i)/(t-e)}function W0(n,e,t){return n!==e?(t-n)/(e-n):0}function ks(n,e,t){return(1-t)*n+t*e}function X0(n,e,t,i){return ks(n,e,1-Math.exp(-t*i))}function Z0(n,e=1){return e-Math.abs(Nc(n,e*2)-e)}function $0(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*(3-2*n))}function q0(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*n*(n*(n*6-15)+10))}function j0(n,e){return n+Math.floor(Math.random()*(e-n+1))}function Y0(n,e){return n+Math.random()*(e-n)}function K0(n){return n*(.5-Math.random())}function J0(n){n!==void 0&&(Fl=n);let e=Fl+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Q0(n){return n*Bs}function ev(n){return n*hs}function tv(n){return(n&n-1)===0&&n!==0}function nv(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function iv(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function sv(n,e,t,i,s){const r=Math.cos,o=Math.sin,a=r(t/2),c=o(t/2),l=r((e+i)/2),u=o((e+i)/2),d=r((e-i)/2),h=o((e-i)/2),f=r((i-e)/2),g=o((i-e)/2);switch(s){case"XYX":n.set(a*u,c*d,c*h,a*l);break;case"YZY":n.set(c*h,a*u,c*d,a*l);break;case"ZXZ":n.set(c*d,c*h,a*u,a*l);break;case"XZX":n.set(a*u,c*g,c*f,a*l);break;case"YXY":n.set(c*f,a*u,c*g,a*l);break;case"ZYZ":n.set(c*g,c*f,a*u,a*l);break;default:be("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function mn(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function et(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const rv={DEG2RAD:Bs,RAD2DEG:hs,generateUUID:_n,clamp:$e,euclideanModulo:Nc,mapLinear:V0,inverseLerp:W0,lerp:ks,damp:X0,pingpong:Z0,smoothstep:$0,smootherstep:q0,randInt:j0,randFloat:Y0,randFloatSpread:K0,seededRandom:J0,degToRad:Q0,radToDeg:ev,isPowerOfTwo:tv,ceilPowerOfTwo:nv,floorPowerOfTwo:iv,setQuaternionFromProperEuler:sv,normalize:et,denormalize:mn};class Ye{static{Ye.prototype.isVector2=!0}constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6],this.y=s[1]*t+s[4]*i+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=$e(this.x,e.x,t.x),this.y=$e(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=$e(this.x,e,t),this.y=$e(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar($e(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos($e(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),s=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*i-o*s+e.x,this.y=r*s+o*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class qn{constructor(e=0,t=0,i=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=s}static slerpFlat(e,t,i,s,r,o,a){let c=i[s+0],l=i[s+1],u=i[s+2],d=i[s+3],h=r[o+0],f=r[o+1],g=r[o+2],x=r[o+3];if(d!==x||c!==h||l!==f||u!==g){let m=c*h+l*f+u*g+d*x;m<0&&(h=-h,f=-f,g=-g,x=-x,m=-m);let p=1-a;if(m<.9995){const S=Math.acos(m),b=Math.sin(S);p=Math.sin(p*S)/b,a=Math.sin(a*S)/b,c=c*p+h*a,l=l*p+f*a,u=u*p+g*a,d=d*p+x*a}else{c=c*p+h*a,l=l*p+f*a,u=u*p+g*a,d=d*p+x*a;const S=1/Math.sqrt(c*c+l*l+u*u+d*d);c*=S,l*=S,u*=S,d*=S}}e[t]=c,e[t+1]=l,e[t+2]=u,e[t+3]=d}static multiplyQuaternionsFlat(e,t,i,s,r,o){const a=i[s],c=i[s+1],l=i[s+2],u=i[s+3],d=r[o],h=r[o+1],f=r[o+2],g=r[o+3];return e[t]=a*g+u*d+c*f-l*h,e[t+1]=c*g+u*h+l*d-a*f,e[t+2]=l*g+u*f+a*h-c*d,e[t+3]=u*g-a*d-c*h-l*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,s){return this._x=e,this._y=t,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,s=e._y,r=e._z,o=e._order,a=Math.cos,c=Math.sin,l=a(i/2),u=a(s/2),d=a(r/2),h=c(i/2),f=c(s/2),g=c(r/2);switch(o){case"XYZ":this._x=h*u*d+l*f*g,this._y=l*f*d-h*u*g,this._z=l*u*g+h*f*d,this._w=l*u*d-h*f*g;break;case"YXZ":this._x=h*u*d+l*f*g,this._y=l*f*d-h*u*g,this._z=l*u*g-h*f*d,this._w=l*u*d+h*f*g;break;case"ZXY":this._x=h*u*d-l*f*g,this._y=l*f*d+h*u*g,this._z=l*u*g+h*f*d,this._w=l*u*d-h*f*g;break;case"ZYX":this._x=h*u*d-l*f*g,this._y=l*f*d+h*u*g,this._z=l*u*g-h*f*d,this._w=l*u*d+h*f*g;break;case"YZX":this._x=h*u*d+l*f*g,this._y=l*f*d+h*u*g,this._z=l*u*g-h*f*d,this._w=l*u*d-h*f*g;break;case"XZY":this._x=h*u*d-l*f*g,this._y=l*f*d-h*u*g,this._z=l*u*g+h*f*d,this._w=l*u*d+h*f*g;break;default:be("Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,s=Math.sin(i);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],s=t[4],r=t[8],o=t[1],a=t[5],c=t[9],l=t[2],u=t[6],d=t[10],h=i+a+d;if(h>0){const f=.5/Math.sqrt(h+1);this._w=.25/f,this._x=(u-c)*f,this._y=(r-l)*f,this._z=(o-s)*f}else if(i>a&&i>d){const f=2*Math.sqrt(1+i-a-d);this._w=(u-c)/f,this._x=.25*f,this._y=(s+o)/f,this._z=(r+l)/f}else if(a>d){const f=2*Math.sqrt(1+a-i-d);this._w=(r-l)/f,this._x=(s+o)/f,this._y=.25*f,this._z=(c+u)/f}else{const f=2*Math.sqrt(1+d-i-a);this._w=(o-s)/f,this._x=(r+l)/f,this._y=(c+u)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs($e(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const s=Math.min(1,t/i);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,s=e._y,r=e._z,o=e._w,a=t._x,c=t._y,l=t._z,u=t._w;return this._x=i*u+o*a+s*l-r*c,this._y=s*u+o*c+r*a-i*l,this._z=r*u+o*l+i*c-s*a,this._w=o*u-i*a-s*c-r*l,this._onChangeCallback(),this}slerp(e,t){let i=e._x,s=e._y,r=e._z,o=e._w,a=this.dot(e);a<0&&(i=-i,s=-s,r=-r,o=-o,a=-a);let c=1-t;if(a<.9995){const l=Math.acos(a),u=Math.sin(l);c=Math.sin(c*l)/u,t=Math.sin(t*l)/u,this._x=this._x*c+i*t,this._y=this._y*c+s*t,this._z=this._z*c+r*t,this._w=this._w*c+o*t,this._onChangeCallback()}else this._x=this._x*c+i*t,this._y=this._y*c+s*t,this._z=this._z*c+r*t,this._w=this._w*c+o*t,this.normalize();return this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class z{static{z.prototype.isVector3=!0}constructor(e=0,t=0,i=0){this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(zl.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(zl.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6]*s,this.y=r[1]*t+r[4]*i+r[7]*s,this.z=r[2]*t+r[5]*i+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,r=e.elements,o=1/(r[3]*t+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*i+r[8]*s+r[12])*o,this.y=(r[1]*t+r[5]*i+r[9]*s+r[13])*o,this.z=(r[2]*t+r[6]*i+r[10]*s+r[14])*o,this}applyQuaternion(e){const t=this.x,i=this.y,s=this.z,r=e.x,o=e.y,a=e.z,c=e.w,l=2*(o*s-a*i),u=2*(a*t-r*s),d=2*(r*i-o*t);return this.x=t+c*l+o*d-a*u,this.y=i+c*u+a*l-r*d,this.z=s+c*d+r*u-o*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*i+r[8]*s,this.y=r[1]*t+r[5]*i+r[9]*s,this.z=r[2]*t+r[6]*i+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=$e(this.x,e.x,t.x),this.y=$e(this.y,e.y,t.y),this.z=$e(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=$e(this.x,e,t),this.y=$e(this.y,e,t),this.z=$e(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar($e(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,s=e.y,r=e.z,o=t.x,a=t.y,c=t.z;return this.x=s*c-r*a,this.y=r*o-i*c,this.z=i*a-s*o,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return yo.copy(this).projectOnVector(e),this.sub(yo)}reflect(e){return this.sub(yo.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos($e(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,s=this.z-e.z;return t*t+i*i+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const s=Math.sin(t)*e;return this.x=s*Math.sin(i),this.y=Math.cos(t)*e,this.z=s*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const yo=new z,zl=new qn;class Oe{static{Oe.prototype.isMatrix3=!0}constructor(e,t,i,s,r,o,a,c,l){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,o,a,c,l)}set(e,t,i,s,r,o,a,c,l){const u=this.elements;return u[0]=e,u[1]=s,u[2]=a,u[3]=t,u[4]=r,u[5]=c,u[6]=i,u[7]=o,u[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,r=this.elements,o=i[0],a=i[3],c=i[6],l=i[1],u=i[4],d=i[7],h=i[2],f=i[5],g=i[8],x=s[0],m=s[3],p=s[6],S=s[1],b=s[4],y=s[7],w=s[2],T=s[5],C=s[8];return r[0]=o*x+a*S+c*w,r[3]=o*m+a*b+c*T,r[6]=o*p+a*y+c*C,r[1]=l*x+u*S+d*w,r[4]=l*m+u*b+d*T,r[7]=l*p+u*y+d*C,r[2]=h*x+f*S+g*w,r[5]=h*m+f*b+g*T,r[8]=h*p+f*y+g*C,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],l=e[7],u=e[8];return t*o*u-t*a*l-i*r*u+i*a*c+s*r*l-s*o*c}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],l=e[7],u=e[8],d=u*o-a*l,h=a*c-u*r,f=l*r-o*c,g=t*d+i*h+s*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const x=1/g;return e[0]=d*x,e[1]=(s*l-u*i)*x,e[2]=(a*i-s*o)*x,e[3]=h*x,e[4]=(u*t-s*c)*x,e[5]=(s*r-a*t)*x,e[6]=f*x,e[7]=(i*c-l*t)*x,e[8]=(o*t-i*r)*x,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,s,r,o,a){const c=Math.cos(r),l=Math.sin(r);return this.set(i*c,i*l,-i*(c*o+l*a)+o+e,-s*l,s*c,-s*(-l*o+c*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(bo.makeScale(e,t)),this}rotate(e){return this.premultiply(bo.makeRotation(-e)),this}translate(e,t){return this.premultiply(bo.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<9;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const bo=new Oe,Bl=new Oe().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),kl=new Oe().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function ov(){const n={enabled:!0,workingColorSpace:sn,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===Qe&&(s.r=Wn(s.r),s.g=Wn(s.g),s.b=Wn(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===Qe&&(s.r=os(s.r),s.g=os(s.g),s.b=os(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===oi?$r:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return oc("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return oc("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[sn]:{primaries:e,whitePoint:i,transfer:$r,toXYZ:Bl,fromXYZ:kl,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:bt},outputColorSpaceConfig:{drawingBufferColorSpace:bt}},[bt]:{primaries:e,whitePoint:i,transfer:Qe,toXYZ:Bl,fromXYZ:kl,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:bt}}}),n}const Ze=ov();function Wn(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function os(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let Ui;class av{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{Ui===void 0&&(Ui=js("canvas")),Ui.width=e.width,Ui.height=e.height;const s=Ui.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),i=Ui}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=js("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const s=i.getImageData(0,0,e.width,e.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Wn(r[o]/255)*255;return i.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(Wn(t[i]/255)*255):t[i]=Wn(t[i]);return{data:t,width:e.width,height:e.height}}else return be("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let cv=0;class Dc{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:cv++}),this.uuid=_n(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(Eo(s[o].image)):r.push(Eo(s[o]))}else r=Eo(s);i.url=r}return t||(e.images[this.uuid]=i),i}}function Eo(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?av.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(be("Texture: Unable to serialize Texture."),{})}let lv=0;const To=new z;class Nt extends Pi{constructor(e=Nt.DEFAULT_IMAGE,t=Nt.DEFAULT_MAPPING,i=Tn,s=Tn,r=Lt,o=Gn,a=un,c=tn,l=Nt.DEFAULT_ANISOTROPY,u=oi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:lv++}),this.uuid=_n(),this.name="",this.source=new Dc(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new Ye(0,0),this.repeat=new Ye(1,1),this.center=new Ye(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Oe,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(To).x}get height(){return this.source.getSize(To).y}get depth(){return this.source.getSize(To).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const i=e[t];if(i===void 0){be(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){be(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==nd)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case li:e.x=e.x-Math.floor(e.x);break;case Tn:e.x=e.x<0?0:1;break;case Wr:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case li:e.y=e.y-Math.floor(e.y);break;case Tn:e.y=e.y<0?0:1;break;case Wr:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Nt.DEFAULT_IMAGE=null;Nt.DEFAULT_MAPPING=nd;Nt.DEFAULT_ANISOTROPY=1;class lt{static{lt.prototype.isVector4=!0}constructor(e=0,t=0,i=0,s=1){this.x=e,this.y=t,this.z=i,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,s){return this.x=e,this.y=t,this.z=i,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*i+o[8]*s+o[12]*r,this.y=o[1]*t+o[5]*i+o[9]*s+o[13]*r,this.z=o[2]*t+o[6]*i+o[10]*s+o[14]*r,this.w=o[3]*t+o[7]*i+o[11]*s+o[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,s,r;const c=e.elements,l=c[0],u=c[4],d=c[8],h=c[1],f=c[5],g=c[9],x=c[2],m=c[6],p=c[10];if(Math.abs(u-h)<.01&&Math.abs(d-x)<.01&&Math.abs(g-m)<.01){if(Math.abs(u+h)<.1&&Math.abs(d+x)<.1&&Math.abs(g+m)<.1&&Math.abs(l+f+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const b=(l+1)/2,y=(f+1)/2,w=(p+1)/2,T=(u+h)/4,C=(d+x)/4,v=(g+m)/4;return b>y&&b>w?b<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(b),s=T/i,r=C/i):y>w?y<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(y),i=T/s,r=v/s):w<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(w),i=C/r,s=v/r),this.set(i,s,r,t),this}let S=Math.sqrt((m-g)*(m-g)+(d-x)*(d-x)+(h-u)*(h-u));return Math.abs(S)<.001&&(S=1),this.x=(m-g)/S,this.y=(d-x)/S,this.z=(h-u)/S,this.w=Math.acos((l+f+p-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=$e(this.x,e.x,t.x),this.y=$e(this.y,e.y,t.y),this.z=$e(this.z,e.z,t.z),this.w=$e(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=$e(this.x,e,t),this.y=$e(this.y,e,t),this.z=$e(this.z,e,t),this.w=$e(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar($e(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class uv extends Pi{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Lt,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new lt(0,0,e,t),this.scissorTest=!1,this.viewport=new lt(0,0,e,t),this.textures=[];const s={width:e,height:t,depth:i.depth},r=new Nt(s),o=i.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(e={}){const t={minFilter:Lt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=i,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new Dc(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this.multiview=e.multiview,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Rn extends uv{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class dd extends Nt{constructor(e=null,t=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=It,this.minFilter=It,this.wrapR=Tn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class hv extends Nt{constructor(e=null,t=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=It,this.minFilter=It,this.wrapR=Tn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class He{static{He.prototype.isMatrix4=!0}constructor(e,t,i,s,r,o,a,c,l,u,d,h,f,g,x,m){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,o,a,c,l,u,d,h,f,g,x,m)}set(e,t,i,s,r,o,a,c,l,u,d,h,f,g,x,m){const p=this.elements;return p[0]=e,p[4]=t,p[8]=i,p[12]=s,p[1]=r,p[5]=o,p[9]=a,p[13]=c,p[2]=l,p[6]=u,p[10]=d,p[14]=h,p[3]=f,p[7]=g,p[11]=x,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new He().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return this.determinant()===0?(e.set(1,0,0),t.set(0,1,0),i.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){if(e.determinant()===0)return this.identity();const t=this.elements,i=e.elements,s=1/Oi.setFromMatrixColumn(e,0).length(),r=1/Oi.setFromMatrixColumn(e,1).length(),o=1/Oi.setFromMatrixColumn(e,2).length();return t[0]=i[0]*s,t[1]=i[1]*s,t[2]=i[2]*s,t[3]=0,t[4]=i[4]*r,t[5]=i[5]*r,t[6]=i[6]*r,t[7]=0,t[8]=i[8]*o,t[9]=i[9]*o,t[10]=i[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,s=e.y,r=e.z,o=Math.cos(i),a=Math.sin(i),c=Math.cos(s),l=Math.sin(s),u=Math.cos(r),d=Math.sin(r);if(e.order==="XYZ"){const h=o*u,f=o*d,g=a*u,x=a*d;t[0]=c*u,t[4]=-c*d,t[8]=l,t[1]=f+g*l,t[5]=h-x*l,t[9]=-a*c,t[2]=x-h*l,t[6]=g+f*l,t[10]=o*c}else if(e.order==="YXZ"){const h=c*u,f=c*d,g=l*u,x=l*d;t[0]=h+x*a,t[4]=g*a-f,t[8]=o*l,t[1]=o*d,t[5]=o*u,t[9]=-a,t[2]=f*a-g,t[6]=x+h*a,t[10]=o*c}else if(e.order==="ZXY"){const h=c*u,f=c*d,g=l*u,x=l*d;t[0]=h-x*a,t[4]=-o*d,t[8]=g+f*a,t[1]=f+g*a,t[5]=o*u,t[9]=x-h*a,t[2]=-o*l,t[6]=a,t[10]=o*c}else if(e.order==="ZYX"){const h=o*u,f=o*d,g=a*u,x=a*d;t[0]=c*u,t[4]=g*l-f,t[8]=h*l+x,t[1]=c*d,t[5]=x*l+h,t[9]=f*l-g,t[2]=-l,t[6]=a*c,t[10]=o*c}else if(e.order==="YZX"){const h=o*c,f=o*l,g=a*c,x=a*l;t[0]=c*u,t[4]=x-h*d,t[8]=g*d+f,t[1]=d,t[5]=o*u,t[9]=-a*u,t[2]=-l*u,t[6]=f*d+g,t[10]=h-x*d}else if(e.order==="XZY"){const h=o*c,f=o*l,g=a*c,x=a*l;t[0]=c*u,t[4]=-d,t[8]=l*u,t[1]=h*d+x,t[5]=o*u,t[9]=f*d-g,t[2]=g*d-f,t[6]=a*u,t[10]=x*d+h}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(dv,e,fv)}lookAt(e,t,i){const s=this.elements;return Qt.subVectors(e,t),Qt.lengthSq()===0&&(Qt.z=1),Qt.normalize(),Qn.crossVectors(i,Qt),Qn.lengthSq()===0&&(Math.abs(i.z)===1?Qt.x+=1e-4:Qt.z+=1e-4,Qt.normalize(),Qn.crossVectors(i,Qt)),Qn.normalize(),nr.crossVectors(Qt,Qn),s[0]=Qn.x,s[4]=nr.x,s[8]=Qt.x,s[1]=Qn.y,s[5]=nr.y,s[9]=Qt.y,s[2]=Qn.z,s[6]=nr.z,s[10]=Qt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,r=this.elements,o=i[0],a=i[4],c=i[8],l=i[12],u=i[1],d=i[5],h=i[9],f=i[13],g=i[2],x=i[6],m=i[10],p=i[14],S=i[3],b=i[7],y=i[11],w=i[15],T=s[0],C=s[4],v=s[8],A=s[12],L=s[1],R=s[5],O=s[9],H=s[13],X=s[2],N=s[6],I=s[10],D=s[14],W=s[3],J=s[7],re=s[11],_e=s[15];return r[0]=o*T+a*L+c*X+l*W,r[4]=o*C+a*R+c*N+l*J,r[8]=o*v+a*O+c*I+l*re,r[12]=o*A+a*H+c*D+l*_e,r[1]=u*T+d*L+h*X+f*W,r[5]=u*C+d*R+h*N+f*J,r[9]=u*v+d*O+h*I+f*re,r[13]=u*A+d*H+h*D+f*_e,r[2]=g*T+x*L+m*X+p*W,r[6]=g*C+x*R+m*N+p*J,r[10]=g*v+x*O+m*I+p*re,r[14]=g*A+x*H+m*D+p*_e,r[3]=S*T+b*L+y*X+w*W,r[7]=S*C+b*R+y*N+w*J,r[11]=S*v+b*O+y*I+w*re,r[15]=S*A+b*H+y*D+w*_e,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],s=e[8],r=e[12],o=e[1],a=e[5],c=e[9],l=e[13],u=e[2],d=e[6],h=e[10],f=e[14],g=e[3],x=e[7],m=e[11],p=e[15],S=c*f-l*h,b=a*f-l*d,y=a*h-c*d,w=o*f-l*u,T=o*h-c*u,C=o*d-a*u;return t*(x*S-m*b+p*y)-i*(g*S-m*w+p*T)+s*(g*b-x*w+p*C)-r*(g*y-x*T+m*C)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],l=e[7],u=e[8],d=e[9],h=e[10],f=e[11],g=e[12],x=e[13],m=e[14],p=e[15],S=t*a-i*o,b=t*c-s*o,y=t*l-r*o,w=i*c-s*a,T=i*l-r*a,C=s*l-r*c,v=u*x-d*g,A=u*m-h*g,L=u*p-f*g,R=d*m-h*x,O=d*p-f*x,H=h*p-f*m,X=S*H-b*O+y*R+w*L-T*A+C*v;if(X===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const N=1/X;return e[0]=(a*H-c*O+l*R)*N,e[1]=(s*O-i*H-r*R)*N,e[2]=(x*C-m*T+p*w)*N,e[3]=(h*T-d*C-f*w)*N,e[4]=(c*L-o*H-l*A)*N,e[5]=(t*H-s*L+r*A)*N,e[6]=(m*y-g*C-p*b)*N,e[7]=(u*C-h*y+f*b)*N,e[8]=(o*O-a*L+l*v)*N,e[9]=(i*L-t*O-r*v)*N,e[10]=(g*T-x*y+p*S)*N,e[11]=(d*y-u*T-f*S)*N,e[12]=(a*A-o*R-c*v)*N,e[13]=(t*R-i*A+s*v)*N,e[14]=(x*b-g*w-m*S)*N,e[15]=(u*w-d*b+h*S)*N,this}scale(e){const t=this.elements,i=e.x,s=e.y,r=e.z;return t[0]*=i,t[4]*=s,t[8]*=r,t[1]*=i,t[5]*=s,t[9]*=r,t[2]*=i,t[6]*=s,t[10]*=r,t[3]*=i,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,s))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),s=Math.sin(t),r=1-i,o=e.x,a=e.y,c=e.z,l=r*o,u=r*a;return this.set(l*o+i,l*a-s*c,l*c+s*a,0,l*a+s*c,u*a+i,u*c-s*o,0,l*c-s*a,u*c+s*o,r*c*c+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,s,r,o){return this.set(1,i,r,0,e,1,o,0,t,s,1,0,0,0,0,1),this}compose(e,t,i){const s=this.elements,r=t._x,o=t._y,a=t._z,c=t._w,l=r+r,u=o+o,d=a+a,h=r*l,f=r*u,g=r*d,x=o*u,m=o*d,p=a*d,S=c*l,b=c*u,y=c*d,w=i.x,T=i.y,C=i.z;return s[0]=(1-(x+p))*w,s[1]=(f+y)*w,s[2]=(g-b)*w,s[3]=0,s[4]=(f-y)*T,s[5]=(1-(h+p))*T,s[6]=(m+S)*T,s[7]=0,s[8]=(g+b)*C,s[9]=(m-S)*C,s[10]=(1-(h+x))*C,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,i){const s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];const r=this.determinant();if(r===0)return i.set(1,1,1),t.identity(),this;let o=Oi.set(s[0],s[1],s[2]).length();const a=Oi.set(s[4],s[5],s[6]).length(),c=Oi.set(s[8],s[9],s[10]).length();r<0&&(o=-o),dn.copy(this);const l=1/o,u=1/a,d=1/c;return dn.elements[0]*=l,dn.elements[1]*=l,dn.elements[2]*=l,dn.elements[4]*=u,dn.elements[5]*=u,dn.elements[6]*=u,dn.elements[8]*=d,dn.elements[9]*=d,dn.elements[10]*=d,t.setFromRotationMatrix(dn),i.x=o,i.y=a,i.z=c,this}makePerspective(e,t,i,s,r,o,a=An,c=!1){const l=this.elements,u=2*r/(t-e),d=2*r/(i-s),h=(t+e)/(t-e),f=(i+s)/(i-s);let g,x;if(c)g=r/(o-r),x=o*r/(o-r);else if(a===An)g=-(o+r)/(o-r),x=-2*o*r/(o-r);else if(a===qs)g=-o/(o-r),x=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=u,l[4]=0,l[8]=h,l[12]=0,l[1]=0,l[5]=d,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=g,l[14]=x,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,i,s,r,o,a=An,c=!1){const l=this.elements,u=2/(t-e),d=2/(i-s),h=-(t+e)/(t-e),f=-(i+s)/(i-s);let g,x;if(c)g=1/(o-r),x=o/(o-r);else if(a===An)g=-2/(o-r),x=-(o+r)/(o-r);else if(a===qs)g=-1/(o-r),x=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=u,l[4]=0,l[8]=0,l[12]=h,l[1]=0,l[5]=d,l[9]=0,l[13]=f,l[2]=0,l[6]=0,l[10]=g,l[14]=x,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<16;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}}const Oi=new z,dn=new He,dv=new z(0,0,0),fv=new z(1,1,1),Qn=new z,nr=new z,Qt=new z,Gl=new He,Hl=new qn;class ui{constructor(e=0,t=0,i=0,s=ui.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,s=this._order){return this._x=e,this._y=t,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const s=e.elements,r=s[0],o=s[4],a=s[8],c=s[1],l=s[5],u=s[9],d=s[2],h=s[6],f=s[10];switch(t){case"XYZ":this._y=Math.asin($e(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,f),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(h,l),this._z=0);break;case"YXZ":this._x=Math.asin(-$e(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin($e(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-d,f),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-$e(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(h,f),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin($e(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-u,l),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-$e(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(h,l),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-u,f),this._y=0);break;default:be("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return Gl.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Gl,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Hl.setFromEuler(this),this.setFromQuaternion(Hl,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}ui.DEFAULT_ORDER="XYZ";class fd{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let pv=0;const Vl=new z,Fi=new qn,Un=new He,ir=new z,bs=new z,mv=new z,gv=new qn,Wl=new z(1,0,0),Xl=new z(0,1,0),Zl=new z(0,0,1),$l={type:"added"},_v={type:"removed"},zi={type:"childadded",child:null},Ao={type:"childremoved",child:null};class ft extends Pi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:pv++}),this.uuid=_n(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=ft.DEFAULT_UP.clone();const e=new z,t=new ui,i=new qn,s=new z(1,1,1);function r(){i.setFromEuler(t,!1)}function o(){t.setFromQuaternion(i,void 0,!1)}t._onChange(r),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new He},normalMatrix:{value:new Oe}}),this.matrix=new He,this.matrixWorld=new He,this.matrixAutoUpdate=ft.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=ft.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new fd,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Fi.setFromAxisAngle(e,t),this.quaternion.multiply(Fi),this}rotateOnWorldAxis(e,t){return Fi.setFromAxisAngle(e,t),this.quaternion.premultiply(Fi),this}rotateX(e){return this.rotateOnAxis(Wl,e)}rotateY(e){return this.rotateOnAxis(Xl,e)}rotateZ(e){return this.rotateOnAxis(Zl,e)}translateOnAxis(e,t){return Vl.copy(e).applyQuaternion(this.quaternion),this.position.add(Vl.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Wl,e)}translateY(e){return this.translateOnAxis(Xl,e)}translateZ(e){return this.translateOnAxis(Zl,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Un.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?ir.copy(e):ir.set(e,t,i);const s=this.parent;this.updateWorldMatrix(!0,!1),bs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Un.lookAt(bs,ir,this.up):Un.lookAt(ir,bs,this.up),this.quaternion.setFromRotationMatrix(Un),s&&(Un.extractRotation(s.matrixWorld),Fi.setFromRotationMatrix(Un),this.quaternion.premultiply(Fi.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Pe("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent($l),zi.child=e,this.dispatchEvent(zi),zi.child=null):Pe("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(_v),Ao.child=e,this.dispatchEvent(Ao),Ao.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Un.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Un.multiply(e.parent.matrixWorld)),e.applyMatrix4(Un),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent($l),zi.child=e,this.dispatchEvent(zi),zi.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,s=this.children.length;i<s;i++){const o=this.children[i].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(bs,e,mv),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(bs,gv,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const t=e.x,i=e.y,s=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*i-r[8]*s,r[13]+=i-r[1]*t-r[5]*i-r[9]*s,r[14]+=s-r[2]*t-r[6]*i-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),this.static!==!1&&(s.static=this.static),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const c=a.shapes;if(Array.isArray(c))for(let l=0,u=c.length;l<u;l++){const d=c[l];r(e.shapes,d)}else r(e.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(r(e.materials,this.material[c]));s.material=a}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){const c=this.animations[a];s.animations.push(r(e.animations,c))}}if(t){const a=o(e.geometries),c=o(e.materials),l=o(e.textures),u=o(e.images),d=o(e.shapes),h=o(e.skeletons),f=o(e.animations),g=o(e.nodes);a.length>0&&(i.geometries=a),c.length>0&&(i.materials=c),l.length>0&&(i.textures=l),u.length>0&&(i.images=u),d.length>0&&(i.shapes=d),h.length>0&&(i.skeletons=h),f.length>0&&(i.animations=f),g.length>0&&(i.nodes=g)}return i.object=s,i;function o(a){const c=[];for(const l in a){const u=a[l];delete u.metadata,c.push(u)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const s=e.children[i];this.add(s.clone())}return this}}ft.DEFAULT_UP=new z(0,1,0);ft.DEFAULT_MATRIX_AUTO_UPDATE=!0;ft.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class nn extends ft{constructor(){super(),this.isGroup=!0,this.type="Group"}}const vv={type:"move"};class wo{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new nn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new nn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new z,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new z),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new nn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new z,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new z,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let s=null,r=null,o=null;const a=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){o=!0;for(const x of e.hand.values()){const m=t.getJointPose(x,i),p=this._getHandJoint(l,x);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const u=l.joints["index-finger-tip"],d=l.joints["thumb-tip"],h=u.position.distanceTo(d.position),f=.02,g=.005;l.inputState.pinching&&h>f+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&h<=f-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,i),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1,c.eventsEnabled&&c.dispatchEvent({type:"gripUpdated",data:e,target:this})));a!==null&&(s=t.getPose(e.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(vv)))}return a!==null&&(a.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new nn;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}const pd={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ei={h:0,s:0,l:0},sr={h:0,s:0,l:0};function Ro(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class Ne{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=bt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Ze.colorSpaceToWorking(this,t),this}setRGB(e,t,i,s=Ze.workingColorSpace){return this.r=e,this.g=t,this.b=i,Ze.colorSpaceToWorking(this,s),this}setHSL(e,t,i,s=Ze.workingColorSpace){if(e=Nc(e,1),t=$e(t,0,1),i=$e(i,0,1),t===0)this.r=this.g=this.b=i;else{const r=i<=.5?i*(1+t):i+t-i*t,o=2*i-r;this.r=Ro(o,r,e+1/3),this.g=Ro(o,r,e),this.b=Ro(o,r,e-1/3)}return Ze.colorSpaceToWorking(this,s),this}setStyle(e,t=bt){function i(r){r!==void 0&&parseFloat(r)<1&&be("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:be("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);be("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=bt){const i=pd[e.toLowerCase()];return i!==void 0?this.setHex(i,t):be("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Wn(e.r),this.g=Wn(e.g),this.b=Wn(e.b),this}copyLinearToSRGB(e){return this.r=os(e.r),this.g=os(e.g),this.b=os(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=bt){return Ze.workingToColorSpace(Ht.copy(this),e),Math.round($e(Ht.r*255,0,255))*65536+Math.round($e(Ht.g*255,0,255))*256+Math.round($e(Ht.b*255,0,255))}getHexString(e=bt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Ze.workingColorSpace){Ze.workingToColorSpace(Ht.copy(this),t);const i=Ht.r,s=Ht.g,r=Ht.b,o=Math.max(i,s,r),a=Math.min(i,s,r);let c,l;const u=(a+o)/2;if(a===o)c=0,l=0;else{const d=o-a;switch(l=u<=.5?d/(o+a):d/(2-o-a),o){case i:c=(s-r)/d+(s<r?6:0);break;case s:c=(r-i)/d+2;break;case r:c=(i-s)/d+4;break}c/=6}return e.h=c,e.s=l,e.l=u,e}getRGB(e,t=Ze.workingColorSpace){return Ze.workingToColorSpace(Ht.copy(this),t),e.r=Ht.r,e.g=Ht.g,e.b=Ht.b,e}getStyle(e=bt){Ze.workingToColorSpace(Ht.copy(this),e);const t=Ht.r,i=Ht.g,s=Ht.b;return e!==bt?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(e,t,i){return this.getHSL(ei),this.setHSL(ei.h+e,ei.s+t,ei.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(ei),e.getHSL(sr);const i=ks(ei.h,sr.h,t),s=ks(ei.s,sr.s,t),r=ks(ei.l,sr.l,t);return this.setHSL(i,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*i+r[6]*s,this.g=r[1]*t+r[4]*i+r[7]*s,this.b=r[2]*t+r[5]*i+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ht=new Ne;Ne.NAMES=pd;class Uc{constructor(e,t=1,i=1e3){this.isFog=!0,this.name="",this.color=new Ne(e),this.near=t,this.far=i}clone(){return new Uc(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class xv extends ft{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new ui,this.environmentIntensity=1,this.environmentRotation=new ui,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}const fn=new z,On=new z,Co=new z,Fn=new z,Bi=new z,ki=new z,ql=new z,Po=new z,Io=new z,Lo=new z,No=new lt,Do=new lt,Uo=new lt;class gn{constructor(e=new z,t=new z,i=new z){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,s){s.subVectors(i,t),fn.subVectors(e,t),s.cross(fn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,i,s,r){fn.subVectors(s,t),On.subVectors(i,t),Co.subVectors(e,t);const o=fn.dot(fn),a=fn.dot(On),c=fn.dot(Co),l=On.dot(On),u=On.dot(Co),d=o*l-a*a;if(d===0)return r.set(0,0,0),null;const h=1/d,f=(l*c-a*u)*h,g=(o*u-a*c)*h;return r.set(1-f-g,g,f)}static containsPoint(e,t,i,s){return this.getBarycoord(e,t,i,s,Fn)===null?!1:Fn.x>=0&&Fn.y>=0&&Fn.x+Fn.y<=1}static getInterpolation(e,t,i,s,r,o,a,c){return this.getBarycoord(e,t,i,s,Fn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,Fn.x),c.addScaledVector(o,Fn.y),c.addScaledVector(a,Fn.z),c)}static getInterpolatedAttribute(e,t,i,s,r,o){return No.setScalar(0),Do.setScalar(0),Uo.setScalar(0),No.fromBufferAttribute(e,t),Do.fromBufferAttribute(e,i),Uo.fromBufferAttribute(e,s),o.setScalar(0),o.addScaledVector(No,r.x),o.addScaledVector(Do,r.y),o.addScaledVector(Uo,r.z),o}static isFrontFacing(e,t,i,s){return fn.subVectors(i,t),On.subVectors(e,t),fn.cross(On).dot(s)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,s){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,i,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return fn.subVectors(this.c,this.b),On.subVectors(this.a,this.b),fn.cross(On).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return gn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return gn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,s,r){return gn.getInterpolation(e,this.a,this.b,this.c,t,i,s,r)}containsPoint(e){return gn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return gn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,s=this.b,r=this.c;let o,a;Bi.subVectors(s,i),ki.subVectors(r,i),Po.subVectors(e,i);const c=Bi.dot(Po),l=ki.dot(Po);if(c<=0&&l<=0)return t.copy(i);Io.subVectors(e,s);const u=Bi.dot(Io),d=ki.dot(Io);if(u>=0&&d<=u)return t.copy(s);const h=c*d-u*l;if(h<=0&&c>=0&&u<=0)return o=c/(c-u),t.copy(i).addScaledVector(Bi,o);Lo.subVectors(e,r);const f=Bi.dot(Lo),g=ki.dot(Lo);if(g>=0&&f<=g)return t.copy(r);const x=f*l-c*g;if(x<=0&&l>=0&&g<=0)return a=l/(l-g),t.copy(i).addScaledVector(ki,a);const m=u*g-f*d;if(m<=0&&d-u>=0&&f-g>=0)return ql.subVectors(r,s),a=(d-u)/(d-u+(f-g)),t.copy(s).addScaledVector(ql,a);const p=1/(m+x+h);return o=x*p,a=h*p,t.copy(i).addScaledVector(Bi,o).addScaledVector(ki,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class jn{constructor(e=new z(1/0,1/0,1/0),t=new z(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(pn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(pn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=pn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const r=i.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,pn):pn.fromBufferAttribute(r,o),pn.applyMatrix4(e.matrixWorld),this.expandByPoint(pn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),rr.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),rr.copy(i.boundingBox)),rr.applyMatrix4(e.matrixWorld),this.union(rr)}const s=e.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,pn),pn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Es),or.subVectors(this.max,Es),Gi.subVectors(e.a,Es),Hi.subVectors(e.b,Es),Vi.subVectors(e.c,Es),ti.subVectors(Hi,Gi),ni.subVectors(Vi,Hi),pi.subVectors(Gi,Vi);let t=[0,-ti.z,ti.y,0,-ni.z,ni.y,0,-pi.z,pi.y,ti.z,0,-ti.x,ni.z,0,-ni.x,pi.z,0,-pi.x,-ti.y,ti.x,0,-ni.y,ni.x,0,-pi.y,pi.x,0];return!Oo(t,Gi,Hi,Vi,or)||(t=[1,0,0,0,1,0,0,0,1],!Oo(t,Gi,Hi,Vi,or))?!1:(ar.crossVectors(ti,ni),t=[ar.x,ar.y,ar.z],Oo(t,Gi,Hi,Vi,or))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,pn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(pn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(zn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),zn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),zn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),zn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),zn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),zn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),zn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),zn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(zn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const zn=[new z,new z,new z,new z,new z,new z,new z,new z],pn=new z,rr=new jn,Gi=new z,Hi=new z,Vi=new z,ti=new z,ni=new z,pi=new z,Es=new z,or=new z,ar=new z,mi=new z;function Oo(n,e,t,i,s){for(let r=0,o=n.length-3;r<=o;r+=3){mi.fromArray(n,r);const a=s.x*Math.abs(mi.x)+s.y*Math.abs(mi.y)+s.z*Math.abs(mi.z),c=e.dot(mi),l=t.dot(mi),u=i.dot(mi);if(Math.max(-Math.max(c,l,u),Math.min(c,l,u))>a)return!1}return!0}const wt=new z,cr=new Ye;let Mv=0;class $t extends Pi{constructor(e,t,i=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Mv++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=rc,this.updateRanges=[],this.gpuType=ln,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[i+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)cr.fromBufferAttribute(this,t),cr.applyMatrix3(e),this.setXY(t,cr.x,cr.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)wt.fromBufferAttribute(this,t),wt.applyMatrix3(e),this.setXYZ(t,wt.x,wt.y,wt.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)wt.fromBufferAttribute(this,t),wt.applyMatrix4(e),this.setXYZ(t,wt.x,wt.y,wt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)wt.fromBufferAttribute(this,t),wt.applyNormalMatrix(e),this.setXYZ(t,wt.x,wt.y,wt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)wt.fromBufferAttribute(this,t),wt.transformDirection(e),this.setXYZ(t,wt.x,wt.y,wt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=mn(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=et(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=mn(t,this.array)),t}setX(e,t){return this.normalized&&(t=et(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=mn(t,this.array)),t}setY(e,t){return this.normalized&&(t=et(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=mn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=et(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=mn(t,this.array)),t}setW(e,t){return this.normalized&&(t=et(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=et(t,this.array),i=et(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,s){return e*=this.itemSize,this.normalized&&(t=et(t,this.array),i=et(i,this.array),s=et(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this}setXYZW(e,t,i,s,r){return e*=this.itemSize,this.normalized&&(t=et(t,this.array),i=et(i,this.array),s=et(s,this.array),r=et(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==rc&&(e.usage=this.usage),e}dispose(){this.dispatchEvent({type:"dispose"})}}class md extends $t{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class gd extends $t{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class Rt extends $t{constructor(e,t,i){super(new Float32Array(e),t,i)}}const Sv=new jn,Ts=new z,Fo=new z;class Ln{constructor(e=new z,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):Sv.setFromPoints(e).getCenter(i);let s=0;for(let r=0,o=e.length;r<o;r++)s=Math.max(s,i.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Ts.subVectors(e,this.center);const t=Ts.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),s=(i-this.radius)*.5;this.center.addScaledVector(Ts,s/i),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Fo.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Ts.copy(e.center).add(Fo)),this.expandByPoint(Ts.copy(e.center).sub(Fo))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let yv=0;const on=new He,zo=new ft,Wi=new z,en=new jn,As=new jn,Ot=new z;class qt extends Pi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:yv++}),this.uuid=_n(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(z0(e)?gd:md)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const r=new Oe().getNormalMatrix(e);i.applyNormalMatrix(r),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return on.makeRotationFromQuaternion(e),this.applyMatrix4(on),this}rotateX(e){return on.makeRotationX(e),this.applyMatrix4(on),this}rotateY(e){return on.makeRotationY(e),this.applyMatrix4(on),this}rotateZ(e){return on.makeRotationZ(e),this.applyMatrix4(on),this}translate(e,t,i){return on.makeTranslation(e,t,i),this.applyMatrix4(on),this}scale(e,t,i){return on.makeScale(e,t,i),this.applyMatrix4(on),this}lookAt(e){return zo.lookAt(e),zo.updateMatrix(),this.applyMatrix4(zo.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Wi).negate(),this.translate(Wi.x,Wi.y,Wi.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let s=0,r=e.length;s<r;s++){const o=e[s];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Rt(i,3))}else{const i=Math.min(e.length,t.count);for(let s=0;s<i;s++){const r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&be("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new jn);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Pe("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new z(-1/0,-1/0,-1/0),new z(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,s=t.length;i<s;i++){const r=t[i];en.setFromBufferAttribute(r),this.morphTargetsRelative?(Ot.addVectors(this.boundingBox.min,en.min),this.boundingBox.expandByPoint(Ot),Ot.addVectors(this.boundingBox.max,en.max),this.boundingBox.expandByPoint(Ot)):(this.boundingBox.expandByPoint(en.min),this.boundingBox.expandByPoint(en.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Pe('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ln);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Pe("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new z,1/0);return}if(e){const i=this.boundingSphere.center;if(en.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){const a=t[r];As.setFromBufferAttribute(a),this.morphTargetsRelative?(Ot.addVectors(en.min,As.min),en.expandByPoint(Ot),Ot.addVectors(en.max,As.max),en.expandByPoint(Ot)):(en.expandByPoint(As.min),en.expandByPoint(As.max))}en.getCenter(i);let s=0;for(let r=0,o=e.count;r<o;r++)Ot.fromBufferAttribute(e,r),s=Math.max(s,i.distanceToSquared(Ot));if(t)for(let r=0,o=t.length;r<o;r++){const a=t[r],c=this.morphTargetsRelative;for(let l=0,u=a.count;l<u;l++)Ot.fromBufferAttribute(a,l),c&&(Wi.fromBufferAttribute(e,l),Ot.add(Wi)),s=Math.max(s,i.distanceToSquared(Ot))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Pe('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Pe("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new $t(new Float32Array(4*i.count),4));const o=this.getAttribute("tangent"),a=[],c=[];for(let v=0;v<i.count;v++)a[v]=new z,c[v]=new z;const l=new z,u=new z,d=new z,h=new Ye,f=new Ye,g=new Ye,x=new z,m=new z;function p(v,A,L){l.fromBufferAttribute(i,v),u.fromBufferAttribute(i,A),d.fromBufferAttribute(i,L),h.fromBufferAttribute(r,v),f.fromBufferAttribute(r,A),g.fromBufferAttribute(r,L),u.sub(l),d.sub(l),f.sub(h),g.sub(h);const R=1/(f.x*g.y-g.x*f.y);isFinite(R)&&(x.copy(u).multiplyScalar(g.y).addScaledVector(d,-f.y).multiplyScalar(R),m.copy(d).multiplyScalar(f.x).addScaledVector(u,-g.x).multiplyScalar(R),a[v].add(x),a[A].add(x),a[L].add(x),c[v].add(m),c[A].add(m),c[L].add(m))}let S=this.groups;S.length===0&&(S=[{start:0,count:e.count}]);for(let v=0,A=S.length;v<A;++v){const L=S[v],R=L.start,O=L.count;for(let H=R,X=R+O;H<X;H+=3)p(e.getX(H+0),e.getX(H+1),e.getX(H+2))}const b=new z,y=new z,w=new z,T=new z;function C(v){w.fromBufferAttribute(s,v),T.copy(w);const A=a[v];b.copy(A),b.sub(w.multiplyScalar(w.dot(A))).normalize(),y.crossVectors(T,A);const R=y.dot(c[v])<0?-1:1;o.setXYZW(v,b.x,b.y,b.z,R)}for(let v=0,A=S.length;v<A;++v){const L=S[v],R=L.start,O=L.count;for(let H=R,X=R+O;H<X;H+=3)C(e.getX(H+0)),C(e.getX(H+1)),C(e.getX(H+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new $t(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let h=0,f=i.count;h<f;h++)i.setXYZ(h,0,0,0);const s=new z,r=new z,o=new z,a=new z,c=new z,l=new z,u=new z,d=new z;if(e)for(let h=0,f=e.count;h<f;h+=3){const g=e.getX(h+0),x=e.getX(h+1),m=e.getX(h+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,x),o.fromBufferAttribute(t,m),u.subVectors(o,r),d.subVectors(s,r),u.cross(d),a.fromBufferAttribute(i,g),c.fromBufferAttribute(i,x),l.fromBufferAttribute(i,m),a.add(u),c.add(u),l.add(u),i.setXYZ(g,a.x,a.y,a.z),i.setXYZ(x,c.x,c.y,c.z),i.setXYZ(m,l.x,l.y,l.z)}else for(let h=0,f=t.count;h<f;h+=3)s.fromBufferAttribute(t,h+0),r.fromBufferAttribute(t,h+1),o.fromBufferAttribute(t,h+2),u.subVectors(o,r),d.subVectors(s,r),u.cross(d),i.setXYZ(h+0,u.x,u.y,u.z),i.setXYZ(h+1,u.x,u.y,u.z),i.setXYZ(h+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)Ot.fromBufferAttribute(e,t),Ot.normalize(),e.setXYZ(t,Ot.x,Ot.y,Ot.z)}toNonIndexed(){function e(a,c){const l=a.array,u=a.itemSize,d=a.normalized,h=new l.constructor(c.length*u);let f=0,g=0;for(let x=0,m=c.length;x<m;x++){a.isInterleavedBufferAttribute?f=c[x]*a.data.stride+a.offset:f=c[x]*u;for(let p=0;p<u;p++)h[g++]=l[f++]}return new $t(h,u,d)}if(this.index===null)return be("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new qt,i=this.index.array,s=this.attributes;for(const a in s){const c=s[a],l=e(c,i);t.setAttribute(a,l)}const r=this.morphAttributes;for(const a in r){const c=[],l=r[a];for(let u=0,d=l.length;u<d;u++){const h=l[u],f=e(h,i);c.push(f)}t.morphAttributes[a]=c}t.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,c=o.length;a<c;a++){const l=o[a];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const c in i){const l=i[c];e.data.attributes[c]=l.toJSON(e.data)}const s={};let r=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],u=[];for(let d=0,h=l.length;d<h;d++){const f=l[d];u.push(f.toJSON(e.data))}u.length>0&&(s[c]=u,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const s=e.attributes;for(const l in s){const u=s[l];this.setAttribute(l,u.clone(t))}const r=e.morphAttributes;for(const l in r){const u=[],d=r[l];for(let h=0,f=d.length;h<f;h++)u.push(d[h].clone(t));this.morphAttributes[l]=u}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let l=0,u=o.length;l<u;l++){const d=o[l];this.addGroup(d.start,d.count,d.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}class bv{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=rc,this.updateRanges=[],this.version=0,this.uuid=_n()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,i){e*=this.stride,i*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[i+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=_n()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(t,this.stride);return i.setUsage(this.usage),i}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=_n()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Vt=new z;class Oc{constructor(e,t,i,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=i,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,i=this.data.count;t<i;t++)Vt.fromBufferAttribute(this,t),Vt.applyMatrix4(e),this.setXYZ(t,Vt.x,Vt.y,Vt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)Vt.fromBufferAttribute(this,t),Vt.applyNormalMatrix(e),this.setXYZ(t,Vt.x,Vt.y,Vt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)Vt.fromBufferAttribute(this,t),Vt.transformDirection(e),this.setXYZ(t,Vt.x,Vt.y,Vt.z);return this}getComponent(e,t){let i=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(i=mn(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=et(i,this.array)),this.data.array[e*this.data.stride+this.offset+t]=i,this}setX(e,t){return this.normalized&&(t=et(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=et(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=et(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=et(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=mn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=mn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=mn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=mn(t,this.array)),t}setXY(e,t,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=et(t,this.array),i=et(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this}setXYZ(e,t,i,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=et(t,this.array),i=et(i,this.array),s=et(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=s,this}setXYZW(e,t,i,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=et(t,this.array),i=et(i,this.array),s=et(s,this.array),r=et(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){qr("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let i=0;i<this.count;i++){const s=i*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new $t(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new Oc(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){qr("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let i=0;i<this.count;i++){const s=i*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}let Ev=0;class Cn extends Pi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Ev++}),this.uuid=_n(),this.name="",this.type="Material",this.blending=rs,this.side=Xn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=va,this.blendDst=xa,this.blendEquation=Mi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ne(0,0,0),this.blendAlpha=0,this.depthFunc=ls,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Dl,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Di,this.stencilZFail=Di,this.stencilZPass=Di,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){be(`Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){be(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==rs&&(i.blending=this.blending),this.side!==Xn&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==va&&(i.blendSrc=this.blendSrc),this.blendDst!==xa&&(i.blendDst=this.blendDst),this.blendEquation!==Mi&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==ls&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Dl&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Di&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Di&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Di&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.allowOverride===!1&&(i.allowOverride=!1),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){const o=[];for(const a in r){const c=r[a];delete c.metadata,o.push(c)}return o}if(t){const r=s(e.textures),o=s(e.images);r.length>0&&(i.textures=r),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const s=t.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=t[r].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}const Bn=new z,Bo=new z,lr=new z,ii=new z,ko=new z,ur=new z,Go=new z;class so{constructor(e=new z,t=new z(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Bn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Bn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Bn.copy(this.origin).addScaledVector(this.direction,t),Bn.distanceToSquared(e))}distanceSqToSegment(e,t,i,s){Bo.copy(e).add(t).multiplyScalar(.5),lr.copy(t).sub(e).normalize(),ii.copy(this.origin).sub(Bo);const r=e.distanceTo(t)*.5,o=-this.direction.dot(lr),a=ii.dot(this.direction),c=-ii.dot(lr),l=ii.lengthSq(),u=Math.abs(1-o*o);let d,h,f,g;if(u>0)if(d=o*c-a,h=o*a-c,g=r*u,d>=0)if(h>=-g)if(h<=g){const x=1/u;d*=x,h*=x,f=d*(d+o*h+2*a)+h*(o*d+h+2*c)+l}else h=r,d=Math.max(0,-(o*h+a)),f=-d*d+h*(h+2*c)+l;else h=-r,d=Math.max(0,-(o*h+a)),f=-d*d+h*(h+2*c)+l;else h<=-g?(d=Math.max(0,-(-o*r+a)),h=d>0?-r:Math.min(Math.max(-r,-c),r),f=-d*d+h*(h+2*c)+l):h<=g?(d=0,h=Math.min(Math.max(-r,-c),r),f=h*(h+2*c)+l):(d=Math.max(0,-(o*r+a)),h=d>0?r:Math.min(Math.max(-r,-c),r),f=-d*d+h*(h+2*c)+l);else h=o>0?-r:r,d=Math.max(0,-(o*h+a)),f=-d*d+h*(h+2*c)+l;return i&&i.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy(Bo).addScaledVector(lr,h),f}intersectSphere(e,t){Bn.subVectors(e.center,this.origin);const i=Bn.dot(this.direction),s=Bn.dot(Bn)-i*i,r=e.radius*e.radius;if(s>r)return null;const o=Math.sqrt(r-s),a=i-o,c=i+o;return c<0?null:a<0?this.at(c,t):this.at(a,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,s,r,o,a,c;const l=1/this.direction.x,u=1/this.direction.y,d=1/this.direction.z,h=this.origin;return l>=0?(i=(e.min.x-h.x)*l,s=(e.max.x-h.x)*l):(i=(e.max.x-h.x)*l,s=(e.min.x-h.x)*l),u>=0?(r=(e.min.y-h.y)*u,o=(e.max.y-h.y)*u):(r=(e.max.y-h.y)*u,o=(e.min.y-h.y)*u),i>o||r>s||((r>i||isNaN(i))&&(i=r),(o<s||isNaN(s))&&(s=o),d>=0?(a=(e.min.z-h.z)*d,c=(e.max.z-h.z)*d):(a=(e.max.z-h.z)*d,c=(e.min.z-h.z)*d),i>c||a>s)||((a>i||i!==i)&&(i=a),(c<s||s!==s)&&(s=c),s<0)?null:this.at(i>=0?i:s,t)}intersectsBox(e){return this.intersectBox(e,Bn)!==null}intersectTriangle(e,t,i,s,r){ko.subVectors(t,e),ur.subVectors(i,e),Go.crossVectors(ko,ur);let o=this.direction.dot(Go),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;ii.subVectors(this.origin,e);const c=a*this.direction.dot(ur.crossVectors(ii,ur));if(c<0)return null;const l=a*this.direction.dot(ko.cross(ii));if(l<0||c+l>o)return null;const u=-a*ii.dot(Go);return u<0?null:this.at(u/o,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ai extends Cn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ne(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ui,this.combine=qh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const jl=new He,gi=new so,hr=new Ln,Yl=new z,dr=new z,fr=new z,pr=new z,Ho=new z,mr=new z,Kl=new z,gr=new z;class Be extends ft{constructor(e=new qt,t=new ai){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){const i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,o=i.morphTargetsRelative;t.fromBufferAttribute(s,e);const a=this.morphTargetInfluences;if(r&&a){mr.set(0,0,0);for(let c=0,l=r.length;c<l;c++){const u=a[c],d=r[c];u!==0&&(Ho.fromBufferAttribute(d,e),o?mr.addScaledVector(Ho,u):mr.addScaledVector(Ho.sub(t),u))}t.add(mr)}return t}raycast(e,t){const i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),hr.copy(i.boundingSphere),hr.applyMatrix4(r),gi.copy(e.ray).recast(e.near),!(hr.containsPoint(gi.origin)===!1&&(gi.intersectSphere(hr,Yl)===null||gi.origin.distanceToSquared(Yl)>(e.far-e.near)**2))&&(jl.copy(r).invert(),gi.copy(e.ray).applyMatrix4(jl),!(i.boundingBox!==null&&gi.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,gi)))}_computeIntersections(e,t,i){let s;const r=this.geometry,o=this.material,a=r.index,c=r.attributes.position,l=r.attributes.uv,u=r.attributes.uv1,d=r.attributes.normal,h=r.groups,f=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,x=h.length;g<x;g++){const m=h[g],p=o[m.materialIndex],S=Math.max(m.start,f.start),b=Math.min(a.count,Math.min(m.start+m.count,f.start+f.count));for(let y=S,w=b;y<w;y+=3){const T=a.getX(y),C=a.getX(y+1),v=a.getX(y+2);s=_r(this,p,e,i,l,u,d,T,C,v),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{const g=Math.max(0,f.start),x=Math.min(a.count,f.start+f.count);for(let m=g,p=x;m<p;m+=3){const S=a.getX(m),b=a.getX(m+1),y=a.getX(m+2);s=_r(this,o,e,i,l,u,d,S,b,y),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}else if(c!==void 0)if(Array.isArray(o))for(let g=0,x=h.length;g<x;g++){const m=h[g],p=o[m.materialIndex],S=Math.max(m.start,f.start),b=Math.min(c.count,Math.min(m.start+m.count,f.start+f.count));for(let y=S,w=b;y<w;y+=3){const T=y,C=y+1,v=y+2;s=_r(this,p,e,i,l,u,d,T,C,v),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{const g=Math.max(0,f.start),x=Math.min(c.count,f.start+f.count);for(let m=g,p=x;m<p;m+=3){const S=m,b=m+1,y=m+2;s=_r(this,o,e,i,l,u,d,S,b,y),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}}}function Tv(n,e,t,i,s,r,o,a){let c;if(e.side===jt?c=i.intersectTriangle(o,r,s,!0,a):c=i.intersectTriangle(s,r,o,e.side===Xn,a),c===null)return null;gr.copy(a),gr.applyMatrix4(n.matrixWorld);const l=t.ray.origin.distanceTo(gr);return l<t.near||l>t.far?null:{distance:l,point:gr.clone(),object:n}}function _r(n,e,t,i,s,r,o,a,c,l){n.getVertexPosition(a,dr),n.getVertexPosition(c,fr),n.getVertexPosition(l,pr);const u=Tv(n,e,t,i,dr,fr,pr,Kl);if(u){const d=new z;gn.getBarycoord(Kl,dr,fr,pr,d),s&&(u.uv=gn.getInterpolatedAttribute(s,a,c,l,d,new Ye)),r&&(u.uv1=gn.getInterpolatedAttribute(r,a,c,l,d,new Ye)),o&&(u.normal=gn.getInterpolatedAttribute(o,a,c,l,d,new z),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));const h={a,b:c,c:l,normal:new z,materialIndex:0};gn.getNormal(dr,fr,pr,h.normal),u.face=h,u.barycoord=d}return u}const ws=new lt,Jl=new lt,Ql=new lt,Av=new lt,eu=new He,vr=new z,Vo=new Ln,tu=new He,Wo=new so;class wv extends Be{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=Cl,this.bindMatrix=new He,this.bindMatrixInverse=new He,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const e=this.geometry;this.boundingBox===null&&(this.boundingBox=new jn),this.boundingBox.makeEmpty();const t=e.getAttribute("position");for(let i=0;i<t.count;i++)this.getVertexPosition(i,vr),this.boundingBox.expandByPoint(vr)}computeBoundingSphere(){const e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new Ln),this.boundingSphere.makeEmpty();const t=e.getAttribute("position");for(let i=0;i<t.count;i++)this.getVertexPosition(i,vr),this.boundingSphere.expandByPoint(vr)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){const i=this.material,s=this.matrixWorld;i!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Vo.copy(this.boundingSphere),Vo.applyMatrix4(s),e.ray.intersectsSphere(Vo)!==!1&&(tu.copy(s).invert(),Wo.copy(e.ray).applyMatrix4(tu),!(this.boundingBox!==null&&Wo.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,Wo)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const e=new lt,t=this.geometry.attributes.skinWeight;for(let i=0,s=t.count;i<s;i++){e.fromBufferAttribute(t,i);const r=1/e.manhattanLength();r!==1/0?e.multiplyScalar(r):e.set(1,0,0,0),t.setXYZW(i,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===Cl?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===w0?this.bindMatrixInverse.copy(this.bindMatrix).invert():be("SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){const i=this.skeleton,s=this.geometry;Jl.fromBufferAttribute(s.attributes.skinIndex,e),Ql.fromBufferAttribute(s.attributes.skinWeight,e),t.isVector4?(ws.copy(t),t.set(0,0,0,0)):(ws.set(...t,1),t.set(0,0,0)),ws.applyMatrix4(this.bindMatrix);for(let r=0;r<4;r++){const o=Ql.getComponent(r);if(o!==0){const a=Jl.getComponent(r);eu.multiplyMatrices(i.bones[a].matrixWorld,i.boneInverses[a]),t.addScaledVector(Av.copy(ws).applyMatrix4(eu),o)}}return t.isVector4&&(t.w=ws.w),t.applyMatrix4(this.bindMatrixInverse)}}class _d extends ft{constructor(){super(),this.isBone=!0,this.type="Bone"}}class Fc extends Nt{constructor(e=null,t=1,i=1,s,r,o,a,c,l=It,u=It,d,h){super(null,o,a,c,l,u,s,r,d,h),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const nu=new He,Rv=new He;class zc{constructor(e=[],t=[]){this.uuid=_n(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.previousBoneMatrices=null,this.boneTexture=null,this.init()}init(){const e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){be("Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let i=0,s=this.bones.length;i<s;i++)this.boneInverses.push(new He)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){const i=new He;this.bones[e]&&i.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(i)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){const i=this.bones[e];i&&i.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){const i=this.bones[e];i&&(i.parent&&i.parent.isBone?(i.matrix.copy(i.parent.matrixWorld).invert(),i.matrix.multiply(i.matrixWorld)):i.matrix.copy(i.matrixWorld),i.matrix.decompose(i.position,i.quaternion,i.scale))}}update(){const e=this.bones,t=this.boneInverses,i=this.boneMatrices,s=this.boneTexture;for(let r=0,o=e.length;r<o;r++){const a=e[r]?e[r].matrixWorld:Rv;nu.multiplyMatrices(a,t[r]),nu.toArray(i,r*16)}s!==null&&(s.needsUpdate=!0)}clone(){return new zc(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);const t=new Float32Array(e*e*4);t.set(this.boneMatrices);const i=new Fc(t,e,e,un,ln);return i.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=i,this}getBoneByName(e){for(let t=0,i=this.bones.length;t<i;t++){const s=this.bones[t];if(s.name===e)return s}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let i=0,s=e.bones.length;i<s;i++){const r=e.bones[i];let o=t[r];o===void 0&&(be("Skeleton: No bone found with UUID:",r),o=new _d),this.bones.push(o),this.boneInverses.push(new He().fromArray(e.boneInverses[i]))}return this.init(),this}toJSON(){const e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;const t=this.bones,i=this.boneInverses;for(let s=0,r=t.length;s<r;s++){const o=t[s];e.bones.push(o.uuid);const a=i[s];e.boneInverses.push(a.toArray())}return e}}class ac extends $t{constructor(e,t,i,s=1){super(e,t,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const Xi=new He,iu=new He,xr=[],su=new jn,Cv=new He,Rs=new Be,Cs=new Ln;class Pv extends Be{constructor(e,t,i){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new ac(new Float32Array(i*16),16),this.previousInstanceMatrix=null,this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<i;s++)this.setMatrixAt(s,Cv)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new jn),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,Xi),su.copy(e.boundingBox).applyMatrix4(Xi),this.boundingBox.union(su)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Ln),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,Xi),Cs.copy(e.boundingSphere).applyMatrix4(Xi),this.boundingSphere.union(Cs)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.previousInstanceMatrix!==null&&(this.previousInstanceMatrix=e.previousInstanceMatrix.clone()),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const i=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=i.length+1,o=e*r+1;for(let a=0;a<i.length;a++)i[a]=s[o+a]}raycast(e,t){const i=this.matrixWorld,s=this.count;if(Rs.geometry=this.geometry,Rs.material=this.material,Rs.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Cs.copy(this.boundingSphere),Cs.applyMatrix4(i),e.ray.intersectsSphere(Cs)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,Xi),iu.multiplyMatrices(i,Xi),Rs.matrixWorld=iu,Rs.raycast(e,xr);for(let o=0,a=xr.length;o<a;o++){const c=xr[o];c.instanceId=r,c.object=this,t.push(c)}xr.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new ac(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){const i=t.morphTargetInfluences,s=i.length+1;this.morphTexture===null&&(this.morphTexture=new Fc(new Float32Array(s*this.count),s,this.count,wc,ln));const r=this.morphTexture.source.data.data;let o=0;for(let l=0;l<i.length;l++)o+=i[l];const a=this.geometry.morphTargetsRelative?1:1-o,c=s*e;return r[c]=a,r.set(i,c+1),this}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const Xo=new z,Iv=new z,Lv=new Oe;class xi{constructor(e=new z(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,s){return this.normal.set(e,t,i),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const s=Xo.subVectors(i,t).cross(Iv.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,i=!0){const s=e.delta(Xo),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const o=-(e.start.dot(this.normal)+this.constant)/r;return i===!0&&(o<0||o>1)?null:t.copy(e.start).addScaledVector(s,o)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||Lv.getNormalMatrix(e),s=this.coplanarPoint(Xo).applyMatrix4(e),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const _i=new Ln,Nv=new Ye(.5,.5),Mr=new z;class Bc{constructor(e=new xi,t=new xi,i=new xi,s=new xi,r=new xi,o=new xi){this.planes=[e,t,i,s,r,o]}set(e,t,i,s,r,o){const a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(i),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=An,i=!1){const s=this.planes,r=e.elements,o=r[0],a=r[1],c=r[2],l=r[3],u=r[4],d=r[5],h=r[6],f=r[7],g=r[8],x=r[9],m=r[10],p=r[11],S=r[12],b=r[13],y=r[14],w=r[15];if(s[0].setComponents(l-o,f-u,p-g,w-S).normalize(),s[1].setComponents(l+o,f+u,p+g,w+S).normalize(),s[2].setComponents(l+a,f+d,p+x,w+b).normalize(),s[3].setComponents(l-a,f-d,p-x,w-b).normalize(),i)s[4].setComponents(c,h,m,y).normalize(),s[5].setComponents(l-c,f-h,p-m,w-y).normalize();else if(s[4].setComponents(l-c,f-h,p-m,w-y).normalize(),t===An)s[5].setComponents(l+c,f+h,p+m,w+y).normalize();else if(t===qs)s[5].setComponents(c,h,m,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),_i.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),_i.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(_i)}intersectsSprite(e){_i.center.set(0,0,0);const t=Nv.distanceTo(e.center);return _i.radius=.7071067811865476+t,_i.applyMatrix4(e.matrixWorld),this.intersectsSphere(_i)}intersectsSphere(e){const t=this.planes,i=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const s=t[i];if(Mr.x=s.normal.x>0?e.max.x:e.min.x,Mr.y=s.normal.y>0?e.max.y:e.min.y,Mr.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(Mr)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class vd extends Cn{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Ne(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const jr=new z,Yr=new z,ru=new He,Ps=new so,Sr=new Ln,Zo=new z,ou=new z;class kc extends ft{constructor(e=new qt,t=new vd){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[0];for(let s=1,r=t.count;s<r;s++)jr.fromBufferAttribute(t,s-1),Yr.fromBufferAttribute(t,s),i[s]=i[s-1],i[s]+=jr.distanceTo(Yr);e.setAttribute("lineDistance",new Rt(i,1))}else be("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const i=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Sr.copy(i.boundingSphere),Sr.applyMatrix4(s),Sr.radius+=r,e.ray.intersectsSphere(Sr)===!1)return;ru.copy(s).invert(),Ps.copy(e.ray).applyMatrix4(ru);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=this.isLineSegments?2:1,u=i.index,h=i.attributes.position;if(u!==null){const f=Math.max(0,o.start),g=Math.min(u.count,o.start+o.count);for(let x=f,m=g-1;x<m;x+=l){const p=u.getX(x),S=u.getX(x+1),b=yr(this,e,Ps,c,p,S,x);b&&t.push(b)}if(this.isLineLoop){const x=u.getX(g-1),m=u.getX(f),p=yr(this,e,Ps,c,x,m,g-1);p&&t.push(p)}}else{const f=Math.max(0,o.start),g=Math.min(h.count,o.start+o.count);for(let x=f,m=g-1;x<m;x+=l){const p=yr(this,e,Ps,c,x,x+1,x);p&&t.push(p)}if(this.isLineLoop){const x=yr(this,e,Ps,c,g-1,f,g-1);x&&t.push(x)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function yr(n,e,t,i,s,r,o){const a=n.geometry.attributes.position;if(jr.fromBufferAttribute(a,s),Yr.fromBufferAttribute(a,r),t.distanceSqToSegment(jr,Yr,Zo,ou)>i)return;Zo.applyMatrix4(n.matrixWorld);const l=e.ray.origin.distanceTo(Zo);if(!(l<e.near||l>e.far))return{distance:l,point:ou.clone().applyMatrix4(n.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:n}}const au=new z,cu=new z;class Dv extends kc{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[];for(let s=0,r=t.count;s<r;s+=2)au.fromBufferAttribute(t,s),cu.fromBufferAttribute(t,s+1),i[s]=s===0?0:i[s-1],i[s+1]=i[s]+au.distanceTo(cu);e.setAttribute("lineDistance",new Rt(i,1))}else be("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Uv extends kc{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}}class xd extends Cn{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Ne(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const lu=new He,cc=new so,br=new Ln,Er=new z;class Ov extends ft{constructor(e=new qt,t=new xd){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const i=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),br.copy(i.boundingSphere),br.applyMatrix4(s),br.radius+=r,e.ray.intersectsSphere(br)===!1)return;lu.copy(s).invert(),cc.copy(e.ray).applyMatrix4(lu);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=i.index,d=i.attributes.position;if(l!==null){const h=Math.max(0,o.start),f=Math.min(l.count,o.start+o.count);for(let g=h,x=f;g<x;g++){const m=l.getX(g);Er.fromBufferAttribute(d,m),uu(Er,m,c,s,e,t,this)}}else{const h=Math.max(0,o.start),f=Math.min(d.count,o.start+o.count);for(let g=h,x=f;g<x;g++)Er.fromBufferAttribute(d,g),uu(Er,g,c,s,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function uu(n,e,t,i,s,r,o){const a=cc.distanceSqToPoint(n);if(a<t){const c=new z;cc.closestPointToPoint(n,c),c.applyMatrix4(i);const l=s.ray.origin.distanceTo(c);if(l<s.near||l>s.far)return;r.push({distance:l,distanceToRay:Math.sqrt(a),point:c,index:e,face:null,faceIndex:null,barycoord:null,object:o})}}class Md extends Nt{constructor(e=[],t=wi,i,s,r,o,a,c,l,u){super(e,t,i,s,r,o,a,c,l,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Kr extends Nt{constructor(e,t,i,s,r,o,a,c,l){super(e,t,i,s,r,o,a,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class ds extends Nt{constructor(e,t,i=Pn,s,r,o,a=It,c=It,l,u=$n,d=1){if(u!==$n&&u!==bi)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const h={width:e,height:t,depth:d};super(h,s,r,o,a,c,u,i,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Dc(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class Fv extends ds{constructor(e,t=Pn,i=wi,s,r,o=It,a=It,c,l=$n){const u={width:e,height:e,depth:1},d=[u,u,u,u,u,u];super(e,e,t,i,s,r,o,a,c,l),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class Sd extends Nt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class zt extends qt{constructor(e=1,t=1,i=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:s,heightSegments:r,depthSegments:o};const a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);const c=[],l=[],u=[],d=[];let h=0,f=0;g("z","y","x",-1,-1,i,t,e,o,r,0),g("z","y","x",1,-1,i,t,-e,o,r,1),g("x","z","y",1,1,e,i,t,s,o,2),g("x","z","y",1,-1,e,i,-t,s,o,3),g("x","y","z",1,-1,e,t,i,s,r,4),g("x","y","z",-1,-1,e,t,-i,s,r,5),this.setIndex(c),this.setAttribute("position",new Rt(l,3)),this.setAttribute("normal",new Rt(u,3)),this.setAttribute("uv",new Rt(d,2));function g(x,m,p,S,b,y,w,T,C,v,A){const L=y/C,R=w/v,O=y/2,H=w/2,X=T/2,N=C+1,I=v+1;let D=0,W=0;const J=new z;for(let re=0;re<I;re++){const _e=re*R-H;for(let Se=0;Se<N;Se++){const ve=Se*L-O;J[x]=ve*S,J[m]=_e*b,J[p]=X,l.push(J.x,J.y,J.z),J[x]=0,J[m]=0,J[p]=T>0?1:-1,u.push(J.x,J.y,J.z),d.push(Se/C),d.push(1-re/v),D+=1}}for(let re=0;re<v;re++)for(let _e=0;_e<C;_e++){const Se=h+_e+N*re,ve=h+_e+N*(re+1),Le=h+(_e+1)+N*(re+1),Re=h+(_e+1)+N*re;c.push(Se,ve,Re),c.push(ve,Le,Re),W+=6}a.addGroup(f,W,A),f+=W,h+=D}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new zt(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class ro extends qt{constructor(e=1,t=32,i=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:i,thetaLength:s},t=Math.max(3,t);const r=[],o=[],a=[],c=[],l=new z,u=new Ye;o.push(0,0,0),a.push(0,0,1),c.push(.5,.5);for(let d=0,h=3;d<=t;d++,h+=3){const f=i+d/t*s;l.x=e*Math.cos(f),l.y=e*Math.sin(f),o.push(l.x,l.y,l.z),a.push(0,0,1),u.x=(o[h]/e+1)/2,u.y=(o[h+1]/e+1)/2,c.push(u.x,u.y)}for(let d=1;d<=t;d++)r.push(d,d+1,0);this.setIndex(r),this.setAttribute("position",new Rt(o,3)),this.setAttribute("normal",new Rt(a,3)),this.setAttribute("uv",new Rt(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ro(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class Ii extends qt{constructor(e=1,t=1,i=1,s=32,r=1,o=!1,a=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:c};const l=this;s=Math.floor(s),r=Math.floor(r);const u=[],d=[],h=[],f=[];let g=0;const x=[],m=i/2;let p=0;S(),o===!1&&(e>0&&b(!0),t>0&&b(!1)),this.setIndex(u),this.setAttribute("position",new Rt(d,3)),this.setAttribute("normal",new Rt(h,3)),this.setAttribute("uv",new Rt(f,2));function S(){const y=new z,w=new z;let T=0;const C=(t-e)/i;for(let v=0;v<=r;v++){const A=[],L=v/r,R=L*(t-e)+e;for(let O=0;O<=s;O++){const H=O/s,X=H*c+a,N=Math.sin(X),I=Math.cos(X);w.x=R*N,w.y=-L*i+m,w.z=R*I,d.push(w.x,w.y,w.z),y.set(N,C,I).normalize(),h.push(y.x,y.y,y.z),f.push(H,1-L),A.push(g++)}x.push(A)}for(let v=0;v<s;v++)for(let A=0;A<r;A++){const L=x[A][v],R=x[A+1][v],O=x[A+1][v+1],H=x[A][v+1];(e>0||A!==0)&&(u.push(L,R,H),T+=3),(t>0||A!==r-1)&&(u.push(R,O,H),T+=3)}l.addGroup(p,T,0),p+=T}function b(y){const w=g,T=new Ye,C=new z;let v=0;const A=y===!0?e:t,L=y===!0?1:-1;for(let O=1;O<=s;O++)d.push(0,m*L,0),h.push(0,L,0),f.push(.5,.5),g++;const R=g;for(let O=0;O<=s;O++){const X=O/s*c+a,N=Math.cos(X),I=Math.sin(X);C.x=A*I,C.y=m*L,C.z=A*N,d.push(C.x,C.y,C.z),h.push(0,L,0),T.x=N*.5+.5,T.y=I*.5*L+.5,f.push(T.x,T.y),g++}for(let O=0;O<s;O++){const H=w+O,X=R+O;y===!0?u.push(X,X+1,H):u.push(X+1,X,H),v+=3}l.addGroup(p,v,y===!0?1:2),p+=v}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ii(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Ys extends qt{constructor(e=1,t=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:s};const r=e/2,o=t/2,a=Math.floor(i),c=Math.floor(s),l=a+1,u=c+1,d=e/a,h=t/c,f=[],g=[],x=[],m=[];for(let p=0;p<u;p++){const S=p*h-o;for(let b=0;b<l;b++){const y=b*d-r;g.push(y,-S,0),x.push(0,0,1),m.push(b/a),m.push(1-p/c)}}for(let p=0;p<c;p++)for(let S=0;S<a;S++){const b=S+l*p,y=S+l*(p+1),w=S+1+l*(p+1),T=S+1+l*p;f.push(b,y,T),f.push(y,w,T)}this.setIndex(f),this.setAttribute("position",new Rt(g,3)),this.setAttribute("normal",new Rt(x,3)),this.setAttribute("uv",new Rt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ys(e.width,e.height,e.widthSegments,e.heightSegments)}}class Ei extends qt{constructor(e=1,t=32,i=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));const c=Math.min(o+a,Math.PI);let l=0;const u=[],d=new z,h=new z,f=[],g=[],x=[],m=[];for(let p=0;p<=i;p++){const S=[],b=p/i;let y=0;p===0&&o===0?y=.5/t:p===i&&c===Math.PI&&(y=-.5/t);for(let w=0;w<=t;w++){const T=w/t;d.x=-e*Math.cos(s+T*r)*Math.sin(o+b*a),d.y=e*Math.cos(o+b*a),d.z=e*Math.sin(s+T*r)*Math.sin(o+b*a),g.push(d.x,d.y,d.z),h.copy(d).normalize(),x.push(h.x,h.y,h.z),m.push(T+y,1-b),S.push(l++)}u.push(S)}for(let p=0;p<i;p++)for(let S=0;S<t;S++){const b=u[p][S+1],y=u[p][S],w=u[p+1][S],T=u[p+1][S+1];(p!==0||o>0)&&f.push(b,y,T),(p!==i-1||c<Math.PI)&&f.push(y,w,T)}this.setIndex(f),this.setAttribute("position",new Rt(g,3)),this.setAttribute("normal",new Rt(x,3)),this.setAttribute("uv",new Rt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ei(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}function fs(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const s=n[t][i];if(hu(s))s.isRenderTargetTexture?(be("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=s.clone();else if(Array.isArray(s))if(hu(s[0])){const r=[];for(let o=0,a=s.length;o<a;o++)r[o]=s[o].clone();e[t][i]=r}else e[t][i]=s.slice();else e[t][i]=s}}return e}function Xt(n){const e={};for(let t=0;t<n.length;t++){const i=fs(n[t]);for(const s in i)e[s]=i[s]}return e}function hu(n){return n&&(n.isColor||n.isMatrix3||n.isMatrix4||n.isVector2||n.isVector3||n.isVector4||n.isTexture||n.isQuaternion)}function zv(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function yd(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Ze.workingColorSpace}const Bv={clone:fs,merge:Xt};var kv=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Gv=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class In extends Cn{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=kv,this.fragmentShader=Gv,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=fs(e.uniforms),this.uniformsGroups=zv(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const o=this.uniforms[s].value;o&&o.isTexture?t.uniforms[s]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[s]={type:"m4",value:o.toArray()}:t.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}class Hv extends In{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class ot extends Cn{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Ne(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ne(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=sc,this.normalScale=new Ye(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ui,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Nn extends ot{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new Ye(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return $e(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Ne(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Ne(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Ne(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}class Vv extends Cn{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=P0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Wv extends Cn{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}function Tr(n,e){return!n||n.constructor===e?n:typeof e.BYTES_PER_ELEMENT=="number"?new e(n):Array.prototype.slice.call(n)}function Xv(n){function e(s,r){return n[s]-n[r]}const t=n.length,i=new Array(t);for(let s=0;s!==t;++s)i[s]=s;return i.sort(e),i}function du(n,e,t){const i=n.length,s=new n.constructor(i);for(let r=0,o=0;o!==i;++r){const a=t[r]*e;for(let c=0;c!==e;++c)s[o++]=n[a+c]}return s}function bd(n,e,t,i){let s=1,r=n[0];for(;r!==void 0&&r[i]===void 0;)r=n[s++];if(r===void 0)return;let o=r[i];if(o!==void 0)if(Array.isArray(o))do o=r[i],o!==void 0&&(e.push(r.time),t.push(...o)),r=n[s++];while(r!==void 0);else if(o.toArray!==void 0)do o=r[i],o!==void 0&&(e.push(r.time),o.toArray(t,t.length)),r=n[s++];while(r!==void 0);else do o=r[i],o!==void 0&&(e.push(r.time),t.push(o)),r=n[s++];while(r!==void 0)}class vs{constructor(e,t,i,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(i),this.sampleValues=t,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(e){const t=this.parameterPositions;let i=this._cachedIndex,s=t[i],r=t[i-1];n:{e:{let o;t:{i:if(!(e<s)){for(let a=i+2;;){if(s===void 0){if(e<r)break i;return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===a)break;if(r=s,s=t[++i],e<s)break e}o=t.length;break t}if(!(e>=r)){const a=t[1];e<a&&(i=2,r=a);for(let c=i-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===c)break;if(s=r,r=t[--i-1],e>=r)break e}o=i,i=0;break t}break n}for(;i<o;){const a=i+o>>>1;e<t[a]?o=a:i=a+1}if(s=t[i],r=t[i-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,r,s)}return this.interpolate_(i,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){const t=this.resultBuffer,i=this.sampleValues,s=this.valueSize,r=e*s;for(let o=0;o!==s;++o)t[o]=i[r+o];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}}class Zv extends vs{constructor(e,t,i,s){super(e,t,i,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Il,endingEnd:Il}}intervalChanged_(e,t,i){const s=this.parameterPositions;let r=e-2,o=e+1,a=s[r],c=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case Ll:r=e,a=2*t-i;break;case Nl:r=s.length-2,a=t+s[r]-s[r+1];break;default:r=e,a=i}if(c===void 0)switch(this.getSettings_().endingEnd){case Ll:o=e,c=2*i-t;break;case Nl:o=1,c=i+s[1]-s[0];break;default:o=e-1,c=t}const l=(i-t)*.5,u=this.valueSize;this._weightPrev=l/(t-a),this._weightNext=l/(c-i),this._offsetPrev=r*u,this._offsetNext=o*u}interpolate_(e,t,i,s){const r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=e*a,l=c-a,u=this._offsetPrev,d=this._offsetNext,h=this._weightPrev,f=this._weightNext,g=(i-t)/(s-t),x=g*g,m=x*g,p=-h*m+2*h*x-h*g,S=(1+h)*m+(-1.5-2*h)*x+(-.5+h)*g+1,b=(-1-f)*m+(1.5+f)*x+.5*g,y=f*m-f*x;for(let w=0;w!==a;++w)r[w]=p*o[u+w]+S*o[l+w]+b*o[c+w]+y*o[d+w];return r}}class $v extends vs{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e,t,i,s){const r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=e*a,l=c-a,u=(i-t)/(s-t),d=1-u;for(let h=0;h!==a;++h)r[h]=o[l+h]*d+o[c+h]*u;return r}}class qv extends vs{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e){return this.copySampleValue_(e-1)}}class jv extends vs{interpolate_(e,t,i,s){const r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=e*a,l=c-a,u=this.settings||this.DefaultSettings_,d=u.inTangents,h=u.outTangents;if(!d||!h){const x=(i-t)/(s-t),m=1-x;for(let p=0;p!==a;++p)r[p]=o[l+p]*m+o[c+p]*x;return r}const f=a*2,g=e-1;for(let x=0;x!==a;++x){const m=o[l+x],p=o[c+x],S=g*f+x*2,b=h[S],y=h[S+1],w=e*f+x*2,T=d[w],C=d[w+1];let v=(i-t)/(s-t),A,L,R,O,H;for(let X=0;X<8;X++){A=v*v,L=A*v,R=1-v,O=R*R,H=O*R;const I=H*t+3*O*v*b+3*R*A*T+L*s-i;if(Math.abs(I)<1e-10)break;const D=3*O*(b-t)+6*R*v*(T-b)+3*A*(s-T);if(Math.abs(D)<1e-10)break;v=v-I/D,v=Math.max(0,Math.min(1,v))}r[x]=H*m+3*O*v*y+3*R*A*C+L*p}return r}}class vn{constructor(e,t,i,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Tr(t,this.TimeBufferType),this.values=Tr(i,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){const t=e.constructor;let i;if(t.toJSON!==this.toJSON)i=t.toJSON(e);else{i={name:e.name,times:Tr(e.times,Array),values:Tr(e.values,Array)};const s=e.getInterpolation();s!==e.DefaultInterpolation&&(i.interpolation=s)}return i.type=e.ValueTypeName,i}InterpolantFactoryMethodDiscrete(e){return new qv(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new $v(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Zv(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){const t=new jv(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.settings=this.settings),t}setInterpolation(e){let t;switch(e){case Zs:t=this.InterpolantFactoryMethodDiscrete;break;case $s:t=this.InterpolantFactoryMethodLinear;break;case So:t=this.InterpolantFactoryMethodSmooth;break;case Pl:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){const i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(i);return be("KeyframeTrack:",i),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Zs;case this.InterpolantFactoryMethodLinear:return $s;case this.InterpolantFactoryMethodSmooth:return So;case this.InterpolantFactoryMethodBezier:return Pl}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){const t=this.times;for(let i=0,s=t.length;i!==s;++i)t[i]+=e}return this}scale(e){if(e!==1){const t=this.times;for(let i=0,s=t.length;i!==s;++i)t[i]*=e}return this}trim(e,t){const i=this.times,s=i.length;let r=0,o=s-1;for(;r!==s&&i[r]<e;)++r;for(;o!==-1&&i[o]>t;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);const a=this.getValueSize();this.times=i.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let e=!0;const t=this.getValueSize();t-Math.floor(t)!==0&&(Pe("KeyframeTrack: Invalid value size in track.",this),e=!1);const i=this.times,s=this.values,r=i.length;r===0&&(Pe("KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==r;a++){const c=i[a];if(typeof c=="number"&&isNaN(c)){Pe("KeyframeTrack: Time is not a valid number.",this,a,c),e=!1;break}if(o!==null&&o>c){Pe("KeyframeTrack: Out of order keys.",this,a,c,o),e=!1;break}o=c}if(s!==void 0&&B0(s))for(let a=0,c=s.length;a!==c;++a){const l=s[a];if(isNaN(l)){Pe("KeyframeTrack: Value is not a valid number.",this,a,l),e=!1;break}}return e}optimize(){const e=this.times.slice(),t=this.values.slice(),i=this.getValueSize(),s=this.getInterpolation()===So,r=e.length-1;let o=1;for(let a=1;a<r;++a){let c=!1;const l=e[a],u=e[a+1];if(l!==u&&(a!==1||l!==e[0]))if(s)c=!0;else{const d=a*i,h=d-i,f=d+i;for(let g=0;g!==i;++g){const x=t[d+g];if(x!==t[h+g]||x!==t[f+g]){c=!0;break}}}if(c){if(a!==o){e[o]=e[a];const d=a*i,h=o*i;for(let f=0;f!==i;++f)t[h+f]=t[d+f]}++o}}if(r>0){e[o]=e[r];for(let a=r*i,c=o*i,l=0;l!==i;++l)t[c+l]=t[a+l];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*i)):(this.times=e,this.values=t),this}clone(){const e=this.times.slice(),t=this.values.slice(),i=this.constructor,s=new i(this.name,e,t);return s.createInterpolant=this.createInterpolant,s}}vn.prototype.ValueTypeName="";vn.prototype.TimeBufferType=Float32Array;vn.prototype.ValueBufferType=Float32Array;vn.prototype.DefaultInterpolation=$s;class xs extends vn{constructor(e,t,i){super(e,t,i)}}xs.prototype.ValueTypeName="bool";xs.prototype.ValueBufferType=Array;xs.prototype.DefaultInterpolation=Zs;xs.prototype.InterpolantFactoryMethodLinear=void 0;xs.prototype.InterpolantFactoryMethodSmooth=void 0;class Ed extends vn{constructor(e,t,i,s){super(e,t,i,s)}}Ed.prototype.ValueTypeName="color";class ps extends vn{constructor(e,t,i,s){super(e,t,i,s)}}ps.prototype.ValueTypeName="number";class Yv extends vs{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e,t,i,s){const r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=(i-t)/(s-t);let l=e*a;for(let u=l+a;l!==u;l+=4)qn.slerpFlat(r,0,o,l-a,o,l,c);return r}}class ms extends vn{constructor(e,t,i,s){super(e,t,i,s)}InterpolantFactoryMethodLinear(e){return new Yv(this.times,this.values,this.getValueSize(),e)}}ms.prototype.ValueTypeName="quaternion";ms.prototype.InterpolantFactoryMethodSmooth=void 0;class Ms extends vn{constructor(e,t,i){super(e,t,i)}}Ms.prototype.ValueTypeName="string";Ms.prototype.ValueBufferType=Array;Ms.prototype.DefaultInterpolation=Zs;Ms.prototype.InterpolantFactoryMethodLinear=void 0;Ms.prototype.InterpolantFactoryMethodSmooth=void 0;class gs extends vn{constructor(e,t,i,s){super(e,t,i,s)}}gs.prototype.ValueTypeName="vector";class Kv{constructor(e="",t=-1,i=[],s=R0){this.name=e,this.tracks=i,this.duration=t,this.blendMode=s,this.uuid=_n(),this.userData={},this.duration<0&&this.resetDuration()}static parse(e){const t=[],i=e.tracks,s=1/(e.fps||1);for(let o=0,a=i.length;o!==a;++o)t.push(Qv(i[o]).scale(s));const r=new this(e.name,e.duration,t,e.blendMode);return r.uuid=e.uuid,r.userData=JSON.parse(e.userData||"{}"),r}static toJSON(e){const t=[],i=e.tracks,s={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let r=0,o=i.length;r!==o;++r)t.push(vn.toJSON(i[r]));return s}static CreateFromMorphTargetSequence(e,t,i,s){const r=t.length,o=[];for(let a=0;a<r;a++){let c=[],l=[];c.push((a+r-1)%r,a,(a+1)%r),l.push(0,1,0);const u=Xv(c);c=du(c,1,u),l=du(l,1,u),!s&&c[0]===0&&(c.push(r),l.push(l[0])),o.push(new ps(".morphTargetInfluences["+t[a].name+"]",c,l).scale(1/i))}return new this(e,-1,o)}static findByName(e,t){let i=e;if(!Array.isArray(e)){const s=e;i=s.geometry&&s.geometry.animations||s.animations}for(let s=0;s<i.length;s++)if(i[s].name===t)return i[s];return null}static CreateClipsFromMorphTargetSequences(e,t,i){const s={},r=/^([\w-]*?)([\d]+)$/;for(let a=0,c=e.length;a<c;a++){const l=e[a],u=l.name.match(r);if(u&&u.length>1){const d=u[1];let h=s[d];h||(s[d]=h=[]),h.push(l)}}const o=[];for(const a in s)o.push(this.CreateFromMorphTargetSequence(a,s[a],t,i));return o}static parseAnimation(e,t){if(be("AnimationClip: parseAnimation() is deprecated and will be removed with r185"),!e)return Pe("AnimationClip: No animation in JSONLoader data."),null;const i=function(d,h,f,g,x){if(f.length!==0){const m=[],p=[];bd(f,m,p,g),m.length!==0&&x.push(new d(h,m,p))}},s=[],r=e.name||"default",o=e.fps||30,a=e.blendMode;let c=e.length||-1;const l=e.hierarchy||[];for(let d=0;d<l.length;d++){const h=l[d].keys;if(!(!h||h.length===0))if(h[0].morphTargets){const f={};let g;for(g=0;g<h.length;g++)if(h[g].morphTargets)for(let x=0;x<h[g].morphTargets.length;x++)f[h[g].morphTargets[x]]=-1;for(const x in f){const m=[],p=[];for(let S=0;S!==h[g].morphTargets.length;++S){const b=h[g];m.push(b.time),p.push(b.morphTarget===x?1:0)}s.push(new ps(".morphTargetInfluence["+x+"]",m,p))}c=f.length*o}else{const f=".bones["+t[d].name+"]";i(gs,f+".position",h,"pos",s),i(ms,f+".quaternion",h,"rot",s),i(gs,f+".scale",h,"scl",s)}}return s.length===0?null:new this(r,c,s,a)}resetDuration(){const e=this.tracks;let t=0;for(let i=0,s=e.length;i!==s;++i){const r=this.tracks[i];t=Math.max(t,r.times[r.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){const e=[];for(let i=0;i<this.tracks.length;i++)e.push(this.tracks[i].clone());const t=new this.constructor(this.name,this.duration,e,this.blendMode);return t.userData=JSON.parse(JSON.stringify(this.userData)),t}toJSON(){return this.constructor.toJSON(this)}}function Jv(n){switch(n.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return ps;case"vector":case"vector2":case"vector3":case"vector4":return gs;case"color":return Ed;case"quaternion":return ms;case"bool":case"boolean":return xs;case"string":return Ms}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+n)}function Qv(n){if(n.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");const e=Jv(n.type);if(n.times===void 0){const t=[],i=[];bd(n.keys,t,i,"value"),n.times=t,n.values=i}return e.parse!==void 0?e.parse(n):new e(n.name,n.times,n.values,n.interpolation)}const Hn={enabled:!1,files:{},add:function(n,e){this.enabled!==!1&&(fu(n)||(this.files[n]=e))},get:function(n){if(this.enabled!==!1&&!fu(n))return this.files[n]},remove:function(n){delete this.files[n]},clear:function(){this.files={}}};function fu(n){try{const e=n.slice(n.indexOf(":")+1);return new URL(e).protocol==="blob:"}catch{return!1}}class ex{constructor(e,t,i){const s=this;let r=!1,o=0,a=0,c;const l=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=i,this._abortController=null,this.itemStart=function(u){a++,r===!1&&s.onStart!==void 0&&s.onStart(u,o,a),r=!0},this.itemEnd=function(u){o++,s.onProgress!==void 0&&s.onProgress(u,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(u){s.onError!==void 0&&s.onError(u)},this.resolveURL=function(u){return c?c(u):u},this.setURLModifier=function(u){return c=u,this},this.addHandler=function(u,d){return l.push(u,d),this},this.removeHandler=function(u){const d=l.indexOf(u);return d!==-1&&l.splice(d,2),this},this.getHandler=function(u){for(let d=0,h=l.length;d<h;d+=2){const f=l[d],g=l[d+1];if(f.global&&(f.lastIndex=0),f.test(u))return g}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}}const tx=new ex;class Ss{constructor(e){this.manager=e!==void 0?e:tx,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){const i=this;return new Promise(function(s,r){i.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}}Ss.DEFAULT_MATERIAL_NAME="__DEFAULT";const kn={};class nx extends Error{constructor(e,t){super(e),this.response=t}}class Td extends Ss{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,i,s){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=Hn.get(`file:${e}`);if(r!==void 0){this.manager.itemStart(e),setTimeout(()=>{t&&t(r),this.manager.itemEnd(e)},0);return}if(kn[e]!==void 0){kn[e].push({onLoad:t,onProgress:i,onError:s});return}kn[e]=[],kn[e].push({onLoad:t,onProgress:i,onError:s});const o=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),a=this.mimeType,c=this.responseType;fetch(o).then(l=>{if(l.status===200||l.status===0){if(l.status===0&&be("FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||l.body===void 0||l.body.getReader===void 0)return l;const u=kn[e],d=l.body.getReader(),h=l.headers.get("X-File-Size")||l.headers.get("Content-Length"),f=h?parseInt(h):0,g=f!==0;let x=0;const m=new ReadableStream({start(p){S();function S(){d.read().then(({done:b,value:y})=>{if(b)p.close();else{x+=y.byteLength;const w=new ProgressEvent("progress",{lengthComputable:g,loaded:x,total:f});for(let T=0,C=u.length;T<C;T++){const v=u[T];v.onProgress&&v.onProgress(w)}p.enqueue(y),S()}},b=>{p.error(b)})}}});return new Response(m)}else throw new nx(`fetch for "${l.url}" responded with ${l.status}: ${l.statusText}`,l)}).then(l=>{switch(c){case"arraybuffer":return l.arrayBuffer();case"blob":return l.blob();case"document":return l.text().then(u=>new DOMParser().parseFromString(u,a));case"json":return l.json();default:if(a==="")return l.text();{const d=/charset="?([^;"\s]*)"?/i.exec(a),h=d&&d[1]?d[1].toLowerCase():void 0,f=new TextDecoder(h);return l.arrayBuffer().then(g=>f.decode(g))}}}).then(l=>{Hn.add(`file:${e}`,l);const u=kn[e];delete kn[e];for(let d=0,h=u.length;d<h;d++){const f=u[d];f.onLoad&&f.onLoad(l)}}).catch(l=>{const u=kn[e];if(u===void 0)throw this.manager.itemError(e),l;delete kn[e];for(let d=0,h=u.length;d<h;d++){const f=u[d];f.onError&&f.onError(l)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}const Zi=new WeakMap;class ix extends Ss{constructor(e){super(e)}load(e,t,i,s){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,o=Hn.get(`image:${e}`);if(o!==void 0){if(o.complete===!0)r.manager.itemStart(e),setTimeout(function(){t&&t(o),r.manager.itemEnd(e)},0);else{let d=Zi.get(o);d===void 0&&(d=[],Zi.set(o,d)),d.push({onLoad:t,onError:s})}return o}const a=js("img");function c(){u(),t&&t(this);const d=Zi.get(this)||[];for(let h=0;h<d.length;h++){const f=d[h];f.onLoad&&f.onLoad(this)}Zi.delete(this),r.manager.itemEnd(e)}function l(d){u(),s&&s(d),Hn.remove(`image:${e}`);const h=Zi.get(this)||[];for(let f=0;f<h.length;f++){const g=h[f];g.onError&&g.onError(d)}Zi.delete(this),r.manager.itemError(e),r.manager.itemEnd(e)}function u(){a.removeEventListener("load",c,!1),a.removeEventListener("error",l,!1)}return a.addEventListener("load",c,!1),a.addEventListener("error",l,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),Hn.add(`image:${e}`,a),r.manager.itemStart(e),a.src=e,a}}class Ad extends Ss{constructor(e){super(e)}load(e,t,i,s){const r=new Nt,o=new ix(this.manager);return o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(e,function(a){r.image=a,r.needsUpdate=!0,t!==void 0&&t(r)},i,s),r}}class oo extends ft{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Ne(e),this.intensity=t}dispose(){this.dispatchEvent({type:"dispose"})}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}}class sx extends oo{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(ft.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ne(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){const t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}}const $o=new He,pu=new z,mu=new z;class Gc{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Ye(512,512),this.mapType=tn,this.map=null,this.mapPass=null,this.matrix=new He,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Bc,this._frameExtents=new Ye(1,1),this._viewportCount=1,this._viewports=[new lt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,i=this.matrix;pu.setFromMatrixPosition(e.matrixWorld),t.position.copy(pu),mu.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(mu),t.updateMatrixWorld(),$o.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix($o,t.coordinateSystem,t.reversedDepth),t.coordinateSystem===qs||t.reversedDepth?i.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply($o)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const Ar=new z,wr=new qn,Sn=new z;class wd extends ft{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new He,this.projectionMatrix=new He,this.projectionMatrixInverse=new He,this.coordinateSystem=An,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Ar,wr,Sn),Sn.x===1&&Sn.y===1&&Sn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Ar,wr,Sn.set(1,1,1)).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorld.decompose(Ar,wr,Sn),Sn.x===1&&Sn.y===1&&Sn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Ar,wr,Sn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const si=new z,gu=new Ye,_u=new Ye;class Zt extends wd{constructor(e=50,t=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=hs*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Bs*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return hs*2*Math.atan(Math.tan(Bs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){si.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(si.x,si.y).multiplyScalar(-e/si.z),si.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(si.x,si.y).multiplyScalar(-e/si.z)}getViewSize(e,t){return this.getViewBounds(e,gu,_u),t.subVectors(_u,gu)}setViewOffset(e,t,i,s,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Bs*.5*this.fov)/this.zoom,i=2*t,s=this.aspect*i,r=-.5*s;const o=this.view;if(this.view!==null&&this.view.enabled){const c=o.fullWidth,l=o.fullHeight;r+=o.offsetX*s/c,t-=o.offsetY*i/l,s*=o.width/c,i*=o.height/l}const a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class rx extends Gc{constructor(){super(new Zt(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){const t=this.camera,i=hs*2*e.angle*this.focus,s=this.mapSize.width/this.mapSize.height*this.aspect,r=e.distance||t.far;(i!==t.fov||s!==t.aspect||r!==t.far)&&(t.fov=i,t.aspect=s,t.far=r,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}}class ox extends oo{constructor(e,t,i=0,s=Math.PI/3,r=0,o=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(ft.DEFAULT_UP),this.updateMatrix(),this.target=new ft,this.distance=i,this.angle=s,this.penumbra=r,this.decay=o,this.map=null,this.shadow=new rx}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.map=e.map,this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.distance=this.distance,t.object.angle=this.angle,t.object.decay=this.decay,t.object.penumbra=this.penumbra,t.object.target=this.target.uuid,this.map&&this.map.isTexture&&(t.object.map=this.map.toJSON(e).uuid),t.object.shadow=this.shadow.toJSON(),t}}class ax extends Gc{constructor(){super(new Zt(90,1,.5,500)),this.isPointLightShadow=!0}}class cx extends oo{constructor(e,t,i=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=s,this.shadow=new ax}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}}class ao extends wd{constructor(e=-1,t=1,i=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=i-e,o=i+e,a=s+t,c=s-t;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,o=r+l*this.view.width,a-=u*this.view.offsetY,c=a-u*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class lx extends Gc{constructor(){super(new ao(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Rd extends oo{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(ft.DEFAULT_UP),this.updateMatrix(),this.target=new ft,this.shadow=new lx}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}}class Gs{static extractUrlBase(e){const t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}}const qo=new WeakMap;class ux extends Ss{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&be("ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&be("ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,i,s){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,o=Hn.get(`image-bitmap:${e}`);if(o!==void 0){if(r.manager.itemStart(e),o.then){o.then(l=>{qo.has(o)===!0?(s&&s(qo.get(o)),r.manager.itemError(e),r.manager.itemEnd(e)):(t&&t(l),r.manager.itemEnd(e))});return}setTimeout(function(){t&&t(o),r.manager.itemEnd(e)},0);return}const a={};a.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",a.headers=this.requestHeader,a.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;const c=fetch(e,a).then(function(l){return l.blob()}).then(function(l){return createImageBitmap(l,Object.assign(r.options,{colorSpaceConversion:"none"}))}).then(function(l){Hn.add(`image-bitmap:${e}`,l),t&&t(l),r.manager.itemEnd(e)}).catch(function(l){s&&s(l),qo.set(c,l),Hn.remove(`image-bitmap:${e}`),r.manager.itemError(e),r.manager.itemEnd(e)});Hn.add(`image-bitmap:${e}`,c),r.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}const $i=-90,qi=1;class hx extends ft{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Zt($i,qi,e,t);s.layers=this.layers,this.add(s);const r=new Zt($i,qi,e,t);r.layers=this.layers,this.add(r);const o=new Zt($i,qi,e,t);o.layers=this.layers,this.add(o);const a=new Zt($i,qi,e,t);a.layers=this.layers,this.add(a);const c=new Zt($i,qi,e,t);c.layers=this.layers,this.add(c);const l=new Zt($i,qi,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,s,r,o,a,c]=t;for(const l of t)this.remove(l);if(e===An)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===qs)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,c,l,u]=this.children,d=e.getRenderTarget(),h=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const x=i.texture.generateMipmaps;i.texture.generateMipmaps=!1;let m=!1;e.isWebGLRenderer===!0?m=e.state.buffers.depth.getReversed():m=e.reversedDepthBuffer,e.setRenderTarget(i,0,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(i,1,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(i,2,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(i,3,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),e.setRenderTarget(i,4,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),i.texture.generateMipmaps=x,e.setRenderTarget(i,5,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,u),e.setRenderTarget(d,h,f),e.xr.enabled=g,i.texture.needsPMREMUpdate=!0}}class dx extends Zt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}const Hc="\\[\\]\\.:\\/",fx=new RegExp("["+Hc+"]","g"),Vc="[^"+Hc+"]",px="[^"+Hc.replace("\\.","")+"]",mx=/((?:WC+[\/:])*)/.source.replace("WC",Vc),gx=/(WCOD+)?/.source.replace("WCOD",px),_x=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Vc),vx=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Vc),xx=new RegExp("^"+mx+gx+_x+vx+"$"),Mx=["material","materials","bones","map"];class Sx{constructor(e,t,i){const s=i||tt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();const i=this._targetGroup.nCachedObjects_,s=this._bindings[i];s!==void 0&&s.getValue(e,t)}setValue(e,t){const i=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=i.length;s!==r;++s)i[s].setValue(e,t)}bind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].bind()}unbind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].unbind()}}class tt{constructor(e,t,i){this.path=t,this.parsedPath=i||tt.parseTrackName(t),this.node=tt.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,i){return e&&e.isAnimationObjectGroup?new tt.Composite(e,t,i):new tt(e,t,i)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(fx,"")}static parseTrackName(e){const t=xx.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);const i={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=i.nodeName&&i.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){const r=i.nodeName.substring(s+1);Mx.indexOf(r)!==-1&&(i.nodeName=i.nodeName.substring(0,s),i.objectName=r)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return i}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){const i=e.skeleton.getBoneByName(t);if(i!==void 0)return i}if(e.children){const i=function(r){for(let o=0;o<r.length;o++){const a=r[o];if(a.name===t||a.uuid===t)return a;const c=i(a.children);if(c)return c}return null},s=i(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){const i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)e[t++]=i[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){const i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){const i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){const i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node;const t=this.parsedPath,i=t.objectName,s=t.propertyName;let r=t.propertyIndex;if(e||(e=tt.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){be("PropertyBinding: No target node found for track: "+this.path+".");return}if(i){let l=t.objectIndex;switch(i){case"materials":if(!e.material){Pe("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){Pe("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){Pe("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let u=0;u<e.length;u++)if(e[u].name===l){l=u;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){Pe("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){Pe("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[i]===void 0){Pe("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[i]}if(l!==void 0){if(e[l]===void 0){Pe("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[l]}}const o=e[s];if(o===void 0){const l=t.nodeName;Pe("PropertyBinding: Trying to update property for track: "+l+"."+s+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?a=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){Pe("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){Pe("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}tt.Composite=Sx;tt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};tt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};tt.prototype.GetterByBindingType=[tt.prototype._getValue_direct,tt.prototype._getValue_array,tt.prototype._getValue_arrayElement,tt.prototype._getValue_toArray];tt.prototype.SetterByBindingTypeAndVersioning=[[tt.prototype._setValue_direct,tt.prototype._setValue_direct_setNeedsUpdate,tt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[tt.prototype._setValue_array,tt.prototype._setValue_array_setNeedsUpdate,tt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[tt.prototype._setValue_arrayElement,tt.prototype._setValue_arrayElement_setNeedsUpdate,tt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[tt.prototype._setValue_fromArray,tt.prototype._setValue_fromArray_setNeedsUpdate,tt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];class Cd{static{Cd.prototype.isMatrix2=!0}constructor(e,t,i,s){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,i,s)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let i=0;i<4;i++)this.elements[i]=e[i+t];return this}set(e,t,i,s){const r=this.elements;return r[0]=e,r[2]=t,r[1]=i,r[3]=s,this}}function vu(n,e,t,i){const s=yx(i);switch(t){case cd:return n*e;case wc:return n*e/s.components*s.byteLength;case Rc:return n*e/s.components*s.byteLength;case Ri:return n*e*2/s.components*s.byteLength;case Cc:return n*e*2/s.components*s.byteLength;case ld:return n*e*3/s.components*s.byteLength;case un:return n*e*4/s.components*s.byteLength;case Pc:return n*e*4/s.components*s.byteLength;case Dr:case Ur:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Or:case Fr:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Ra:case Pa:return Math.max(n,16)*Math.max(e,8)/4;case wa:case Ca:return Math.max(n,8)*Math.max(e,8)/2;case Ia:case La:case Da:case Ua:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Na:case Xr:case Oa:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Fa:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case za:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case Ba:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case ka:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case Ga:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case Ha:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case Va:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case Wa:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case Xa:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case Za:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case $a:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case qa:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case ja:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case Ya:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case Ka:case Ja:case Qa:return Math.ceil(n/4)*Math.ceil(e/4)*16;case ec:case tc:return Math.ceil(n/4)*Math.ceil(e/4)*8;case Zr:case nc:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function yx(n){switch(n){case tn:case sd:return{byteLength:1,components:1};case Ws:case rd:case Zn:return{byteLength:2,components:1};case Tc:case Ac:return{byteLength:2,components:4};case Pn:case Ec:case ln:return{byteLength:4,components:1};case od:case ad:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:bc}}));typeof window<"u"&&(window.__THREE__?be("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=bc);/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Pd(){let n=null,e=!1,t=null,i=null;function s(r,o){t(r,o),i=n.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&n!==null&&(i=n.requestAnimationFrame(s),e=!0)},stop:function(){n!==null&&n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){n=r}}}function bx(n){const e=new WeakMap;function t(a,c){const l=a.array,u=a.usage,d=l.byteLength,h=n.createBuffer();n.bindBuffer(c,h),n.bufferData(c,l,u),a.onUploadCallback();let f;if(l instanceof Float32Array)f=n.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)f=n.HALF_FLOAT;else if(l instanceof Uint16Array)a.isFloat16BufferAttribute?f=n.HALF_FLOAT:f=n.UNSIGNED_SHORT;else if(l instanceof Int16Array)f=n.SHORT;else if(l instanceof Uint32Array)f=n.UNSIGNED_INT;else if(l instanceof Int32Array)f=n.INT;else if(l instanceof Int8Array)f=n.BYTE;else if(l instanceof Uint8Array)f=n.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)f=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:h,type:f,bytesPerElement:l.BYTES_PER_ELEMENT,version:a.version,size:d}}function i(a,c,l){const u=c.array,d=c.updateRanges;if(n.bindBuffer(l,a),d.length===0)n.bufferSubData(l,0,u);else{d.sort((f,g)=>f.start-g.start);let h=0;for(let f=1;f<d.length;f++){const g=d[h],x=d[f];x.start<=g.start+g.count+1?g.count=Math.max(g.count,x.start+x.count-g.start):(++h,d[h]=x)}d.length=h+1;for(let f=0,g=d.length;f<g;f++){const x=d[f];n.bufferSubData(l,x.start*u.BYTES_PER_ELEMENT,u,x.start,x.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);const c=e.get(a);c&&(n.deleteBuffer(c.buffer),e.delete(a))}function o(a,c){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const u=e.get(a);(!u||u.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const l=e.get(a);if(l===void 0)e.set(a,t(a,c));else if(l.version<a.version){if(l.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(l.buffer,a,c),l.version=a.version}}return{get:s,remove:r,update:o}}var Ex=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Tx=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Ax=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,wx=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Rx=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Cx=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Px=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Ix=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Lx=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,Nx=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Dx=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Ux=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Ox=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Fx=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,zx=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Bx=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,kx=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Gx=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Hx=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Vx=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Wx=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Xx=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Zx=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,$x=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,qx=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,jx=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Yx=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Kx=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Jx=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Qx=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,eM="gl_FragColor = linearToOutputTexel( gl_FragColor );",tM=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,nM=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,iM=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,sM=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,rM=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,oM=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,aM=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,cM=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,lM=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,uM=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,hM=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,dM=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,fM=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,pM=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,mM=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,gM=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,_M=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,vM=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,xM=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,MM=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,SM=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,yM=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,bM=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = inverseTransformDirection( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,EM=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,TM=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,AM=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,wM=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,RM=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,CM=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,PM=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,IM=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,LM=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,NM=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,DM=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,UM=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,OM=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,FM=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,zM=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,BM=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,kM=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,GM=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,HM=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,VM=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,WM=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,XM=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,ZM=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,$M=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,qM=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,jM=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,YM=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,KM=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,JM=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,QM=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,eS=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,tS=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,nS=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,iS=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,sS=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,rS=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,oS=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,aS=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,cS=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,lS=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,uS=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,hS=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,dS=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,fS=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,pS=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,mS=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,gS=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,_S=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,vS=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,xS=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,MS=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,SS=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,yS=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,bS=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const ES=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,TS=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,AS=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,wS=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,RS=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,CS=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,PS=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,IS=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,LS=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,NS=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,DS=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,US=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,OS=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,FS=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,zS=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,BS=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,kS=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,GS=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,HS=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,VS=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,WS=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,XS=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,ZS=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,$S=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,qS=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,jS=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,YS=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,KS=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,JS=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,QS=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,ey=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,ty=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,ny=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,iy=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Ge={alphahash_fragment:Ex,alphahash_pars_fragment:Tx,alphamap_fragment:Ax,alphamap_pars_fragment:wx,alphatest_fragment:Rx,alphatest_pars_fragment:Cx,aomap_fragment:Px,aomap_pars_fragment:Ix,batching_pars_vertex:Lx,batching_vertex:Nx,begin_vertex:Dx,beginnormal_vertex:Ux,bsdfs:Ox,iridescence_fragment:Fx,bumpmap_pars_fragment:zx,clipping_planes_fragment:Bx,clipping_planes_pars_fragment:kx,clipping_planes_pars_vertex:Gx,clipping_planes_vertex:Hx,color_fragment:Vx,color_pars_fragment:Wx,color_pars_vertex:Xx,color_vertex:Zx,common:$x,cube_uv_reflection_fragment:qx,defaultnormal_vertex:jx,displacementmap_pars_vertex:Yx,displacementmap_vertex:Kx,emissivemap_fragment:Jx,emissivemap_pars_fragment:Qx,colorspace_fragment:eM,colorspace_pars_fragment:tM,envmap_fragment:nM,envmap_common_pars_fragment:iM,envmap_pars_fragment:sM,envmap_pars_vertex:rM,envmap_physical_pars_fragment:gM,envmap_vertex:oM,fog_vertex:aM,fog_pars_vertex:cM,fog_fragment:lM,fog_pars_fragment:uM,gradientmap_pars_fragment:hM,lightmap_pars_fragment:dM,lights_lambert_fragment:fM,lights_lambert_pars_fragment:pM,lights_pars_begin:mM,lights_toon_fragment:_M,lights_toon_pars_fragment:vM,lights_phong_fragment:xM,lights_phong_pars_fragment:MM,lights_physical_fragment:SM,lights_physical_pars_fragment:yM,lights_fragment_begin:bM,lights_fragment_maps:EM,lights_fragment_end:TM,lightprobes_pars_fragment:AM,logdepthbuf_fragment:wM,logdepthbuf_pars_fragment:RM,logdepthbuf_pars_vertex:CM,logdepthbuf_vertex:PM,map_fragment:IM,map_pars_fragment:LM,map_particle_fragment:NM,map_particle_pars_fragment:DM,metalnessmap_fragment:UM,metalnessmap_pars_fragment:OM,morphinstance_vertex:FM,morphcolor_vertex:zM,morphnormal_vertex:BM,morphtarget_pars_vertex:kM,morphtarget_vertex:GM,normal_fragment_begin:HM,normal_fragment_maps:VM,normal_pars_fragment:WM,normal_pars_vertex:XM,normal_vertex:ZM,normalmap_pars_fragment:$M,clearcoat_normal_fragment_begin:qM,clearcoat_normal_fragment_maps:jM,clearcoat_pars_fragment:YM,iridescence_pars_fragment:KM,opaque_fragment:JM,packing:QM,premultiplied_alpha_fragment:eS,project_vertex:tS,dithering_fragment:nS,dithering_pars_fragment:iS,roughnessmap_fragment:sS,roughnessmap_pars_fragment:rS,shadowmap_pars_fragment:oS,shadowmap_pars_vertex:aS,shadowmap_vertex:cS,shadowmask_pars_fragment:lS,skinbase_vertex:uS,skinning_pars_vertex:hS,skinning_vertex:dS,skinnormal_vertex:fS,specularmap_fragment:pS,specularmap_pars_fragment:mS,tonemapping_fragment:gS,tonemapping_pars_fragment:_S,transmission_fragment:vS,transmission_pars_fragment:xS,uv_pars_fragment:MS,uv_pars_vertex:SS,uv_vertex:yS,worldpos_vertex:bS,background_vert:ES,background_frag:TS,backgroundCube_vert:AS,backgroundCube_frag:wS,cube_vert:RS,cube_frag:CS,depth_vert:PS,depth_frag:IS,distance_vert:LS,distance_frag:NS,equirect_vert:DS,equirect_frag:US,linedashed_vert:OS,linedashed_frag:FS,meshbasic_vert:zS,meshbasic_frag:BS,meshlambert_vert:kS,meshlambert_frag:GS,meshmatcap_vert:HS,meshmatcap_frag:VS,meshnormal_vert:WS,meshnormal_frag:XS,meshphong_vert:ZS,meshphong_frag:$S,meshphysical_vert:qS,meshphysical_frag:jS,meshtoon_vert:YS,meshtoon_frag:KS,points_vert:JS,points_frag:QS,shadow_vert:ey,shadow_frag:ty,sprite_vert:ny,sprite_frag:iy},he={common:{diffuse:{value:new Ne(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Oe},alphaMap:{value:null},alphaMapTransform:{value:new Oe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Oe}},envmap:{envMap:{value:null},envMapRotation:{value:new Oe},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Oe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Oe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Oe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Oe},normalScale:{value:new Ye(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Oe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Oe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Oe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Oe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ne(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new z},probesMax:{value:new z},probesResolution:{value:new z}},points:{diffuse:{value:new Ne(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Oe},alphaTest:{value:0},uvTransform:{value:new Oe}},sprite:{diffuse:{value:new Ne(16777215)},opacity:{value:1},center:{value:new Ye(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Oe},alphaMap:{value:null},alphaMapTransform:{value:new Oe},alphaTest:{value:0}}},En={basic:{uniforms:Xt([he.common,he.specularmap,he.envmap,he.aomap,he.lightmap,he.fog]),vertexShader:Ge.meshbasic_vert,fragmentShader:Ge.meshbasic_frag},lambert:{uniforms:Xt([he.common,he.specularmap,he.envmap,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.fog,he.lights,{emissive:{value:new Ne(0)},envMapIntensity:{value:1}}]),vertexShader:Ge.meshlambert_vert,fragmentShader:Ge.meshlambert_frag},phong:{uniforms:Xt([he.common,he.specularmap,he.envmap,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.fog,he.lights,{emissive:{value:new Ne(0)},specular:{value:new Ne(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Ge.meshphong_vert,fragmentShader:Ge.meshphong_frag},standard:{uniforms:Xt([he.common,he.envmap,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.roughnessmap,he.metalnessmap,he.fog,he.lights,{emissive:{value:new Ne(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ge.meshphysical_vert,fragmentShader:Ge.meshphysical_frag},toon:{uniforms:Xt([he.common,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.gradientmap,he.fog,he.lights,{emissive:{value:new Ne(0)}}]),vertexShader:Ge.meshtoon_vert,fragmentShader:Ge.meshtoon_frag},matcap:{uniforms:Xt([he.common,he.bumpmap,he.normalmap,he.displacementmap,he.fog,{matcap:{value:null}}]),vertexShader:Ge.meshmatcap_vert,fragmentShader:Ge.meshmatcap_frag},points:{uniforms:Xt([he.points,he.fog]),vertexShader:Ge.points_vert,fragmentShader:Ge.points_frag},dashed:{uniforms:Xt([he.common,he.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ge.linedashed_vert,fragmentShader:Ge.linedashed_frag},depth:{uniforms:Xt([he.common,he.displacementmap]),vertexShader:Ge.depth_vert,fragmentShader:Ge.depth_frag},normal:{uniforms:Xt([he.common,he.bumpmap,he.normalmap,he.displacementmap,{opacity:{value:1}}]),vertexShader:Ge.meshnormal_vert,fragmentShader:Ge.meshnormal_frag},sprite:{uniforms:Xt([he.sprite,he.fog]),vertexShader:Ge.sprite_vert,fragmentShader:Ge.sprite_frag},background:{uniforms:{uvTransform:{value:new Oe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ge.background_vert,fragmentShader:Ge.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Oe}},vertexShader:Ge.backgroundCube_vert,fragmentShader:Ge.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ge.cube_vert,fragmentShader:Ge.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ge.equirect_vert,fragmentShader:Ge.equirect_frag},distance:{uniforms:Xt([he.common,he.displacementmap,{referencePosition:{value:new z},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ge.distance_vert,fragmentShader:Ge.distance_frag},shadow:{uniforms:Xt([he.lights,he.fog,{color:{value:new Ne(0)},opacity:{value:1}}]),vertexShader:Ge.shadow_vert,fragmentShader:Ge.shadow_frag}};En.physical={uniforms:Xt([En.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Oe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Oe},clearcoatNormalScale:{value:new Ye(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Oe},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Oe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Oe},sheen:{value:0},sheenColor:{value:new Ne(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Oe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Oe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Oe},transmissionSamplerSize:{value:new Ye},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Oe},attenuationDistance:{value:0},attenuationColor:{value:new Ne(0)},specularColor:{value:new Ne(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Oe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Oe},anisotropyVector:{value:new Ye},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Oe}}]),vertexShader:Ge.meshphysical_vert,fragmentShader:Ge.meshphysical_frag};const Rr={r:0,b:0,g:0},sy=new He,Id=new Oe;Id.set(-1,0,0,0,1,0,0,0,1);function ry(n,e,t,i,s,r){const o=new Ne(0);let a=s===!0?0:1,c,l,u=null,d=0,h=null;function f(S){let b=S.isScene===!0?S.background:null;if(b&&b.isTexture){const y=S.backgroundBlurriness>0;b=e.get(b,y)}return b}function g(S){let b=!1;const y=f(S);y===null?m(o,a):y&&y.isColor&&(m(y,1),b=!0);const w=n.xr.getEnvironmentBlendMode();w==="additive"?t.buffers.color.setClear(0,0,0,1,r):w==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(n.autoClear||b)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function x(S,b){const y=f(b);y&&(y.isCubeTexture||y.mapping===io)?(l===void 0&&(l=new Be(new zt(1,1,1),new In({name:"BackgroundCubeMaterial",uniforms:fs(En.backgroundCube.uniforms),vertexShader:En.backgroundCube.vertexShader,fragmentShader:En.backgroundCube.fragmentShader,side:jt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),l.geometry.deleteAttribute("uv"),l.onBeforeRender=function(w,T,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(l)),l.material.uniforms.envMap.value=y,l.material.uniforms.backgroundBlurriness.value=b.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(sy.makeRotationFromEuler(b.backgroundRotation)).transpose(),y.isCubeTexture&&y.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(Id),l.material.toneMapped=Ze.getTransfer(y.colorSpace)!==Qe,(u!==y||d!==y.version||h!==n.toneMapping)&&(l.material.needsUpdate=!0,u=y,d=y.version,h=n.toneMapping),l.layers.enableAll(),S.unshift(l,l.geometry,l.material,0,0,null)):y&&y.isTexture&&(c===void 0&&(c=new Be(new Ys(2,2),new In({name:"BackgroundMaterial",uniforms:fs(En.background.uniforms),vertexShader:En.background.vertexShader,fragmentShader:En.background.fragmentShader,side:Xn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(c)),c.material.uniforms.t2D.value=y,c.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,c.material.toneMapped=Ze.getTransfer(y.colorSpace)!==Qe,y.matrixAutoUpdate===!0&&y.updateMatrix(),c.material.uniforms.uvTransform.value.copy(y.matrix),(u!==y||d!==y.version||h!==n.toneMapping)&&(c.material.needsUpdate=!0,u=y,d=y.version,h=n.toneMapping),c.layers.enableAll(),S.unshift(c,c.geometry,c.material,0,0,null))}function m(S,b){S.getRGB(Rr,yd(n)),t.buffers.color.setClear(Rr.r,Rr.g,Rr.b,b,r)}function p(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(S,b=1){o.set(S),a=b,m(o,a)},getClearAlpha:function(){return a},setClearAlpha:function(S){a=S,m(o,a)},render:g,addToRenderList:x,dispose:p}}function oy(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=h(null);let r=s,o=!1;function a(R,O,H,X,N){let I=!1;const D=d(R,X,H,O);r!==D&&(r=D,l(r.object)),I=f(R,X,H,N),I&&g(R,X,H,N),N!==null&&e.update(N,n.ELEMENT_ARRAY_BUFFER),(I||o)&&(o=!1,y(R,O,H,X),N!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(N).buffer))}function c(){return n.createVertexArray()}function l(R){return n.bindVertexArray(R)}function u(R){return n.deleteVertexArray(R)}function d(R,O,H,X){const N=X.wireframe===!0;let I=i[O.id];I===void 0&&(I={},i[O.id]=I);const D=R.isInstancedMesh===!0?R.id:0;let W=I[D];W===void 0&&(W={},I[D]=W);let J=W[H.id];J===void 0&&(J={},W[H.id]=J);let re=J[N];return re===void 0&&(re=h(c()),J[N]=re),re}function h(R){const O=[],H=[],X=[];for(let N=0;N<t;N++)O[N]=0,H[N]=0,X[N]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:O,enabledAttributes:H,attributeDivisors:X,object:R,attributes:{},index:null}}function f(R,O,H,X){const N=r.attributes,I=O.attributes;let D=0;const W=H.getAttributes();for(const J in W)if(W[J].location>=0){const _e=N[J];let Se=I[J];if(Se===void 0&&(J==="instanceMatrix"&&R.instanceMatrix&&(Se=R.instanceMatrix),J==="instanceColor"&&R.instanceColor&&(Se=R.instanceColor)),_e===void 0||_e.attribute!==Se||Se&&_e.data!==Se.data)return!0;D++}return r.attributesNum!==D||r.index!==X}function g(R,O,H,X){const N={},I=O.attributes;let D=0;const W=H.getAttributes();for(const J in W)if(W[J].location>=0){let _e=I[J];_e===void 0&&(J==="instanceMatrix"&&R.instanceMatrix&&(_e=R.instanceMatrix),J==="instanceColor"&&R.instanceColor&&(_e=R.instanceColor));const Se={};Se.attribute=_e,_e&&_e.data&&(Se.data=_e.data),N[J]=Se,D++}r.attributes=N,r.attributesNum=D,r.index=X}function x(){const R=r.newAttributes;for(let O=0,H=R.length;O<H;O++)R[O]=0}function m(R){p(R,0)}function p(R,O){const H=r.newAttributes,X=r.enabledAttributes,N=r.attributeDivisors;H[R]=1,X[R]===0&&(n.enableVertexAttribArray(R),X[R]=1),N[R]!==O&&(n.vertexAttribDivisor(R,O),N[R]=O)}function S(){const R=r.newAttributes,O=r.enabledAttributes;for(let H=0,X=O.length;H<X;H++)O[H]!==R[H]&&(n.disableVertexAttribArray(H),O[H]=0)}function b(R,O,H,X,N,I,D){D===!0?n.vertexAttribIPointer(R,O,H,N,I):n.vertexAttribPointer(R,O,H,X,N,I)}function y(R,O,H,X){x();const N=X.attributes,I=H.getAttributes(),D=O.defaultAttributeValues;for(const W in I){const J=I[W];if(J.location>=0){let re=N[W];if(re===void 0&&(W==="instanceMatrix"&&R.instanceMatrix&&(re=R.instanceMatrix),W==="instanceColor"&&R.instanceColor&&(re=R.instanceColor)),re!==void 0){const _e=re.normalized,Se=re.itemSize,ve=e.get(re);if(ve===void 0)continue;const Le=ve.buffer,Re=ve.type,q=ve.bytesPerElement,le=Re===n.INT||Re===n.UNSIGNED_INT||re.gpuType===Ec;if(re.isInterleavedBufferAttribute){const te=re.data,Ce=te.stride,Ue=re.offset;if(te.isInstancedInterleavedBuffer){for(let Ie=0;Ie<J.locationSize;Ie++)p(J.location+Ie,te.meshPerAttribute);R.isInstancedMesh!==!0&&X._maxInstanceCount===void 0&&(X._maxInstanceCount=te.meshPerAttribute*te.count)}else for(let Ie=0;Ie<J.locationSize;Ie++)m(J.location+Ie);n.bindBuffer(n.ARRAY_BUFFER,Le);for(let Ie=0;Ie<J.locationSize;Ie++)b(J.location+Ie,Se/J.locationSize,Re,_e,Ce*q,(Ue+Se/J.locationSize*Ie)*q,le)}else{if(re.isInstancedBufferAttribute){for(let te=0;te<J.locationSize;te++)p(J.location+te,re.meshPerAttribute);R.isInstancedMesh!==!0&&X._maxInstanceCount===void 0&&(X._maxInstanceCount=re.meshPerAttribute*re.count)}else for(let te=0;te<J.locationSize;te++)m(J.location+te);n.bindBuffer(n.ARRAY_BUFFER,Le);for(let te=0;te<J.locationSize;te++)b(J.location+te,Se/J.locationSize,Re,_e,Se*q,Se/J.locationSize*te*q,le)}}else if(D!==void 0){const _e=D[W];if(_e!==void 0)switch(_e.length){case 2:n.vertexAttrib2fv(J.location,_e);break;case 3:n.vertexAttrib3fv(J.location,_e);break;case 4:n.vertexAttrib4fv(J.location,_e);break;default:n.vertexAttrib1fv(J.location,_e)}}}}S()}function w(){A();for(const R in i){const O=i[R];for(const H in O){const X=O[H];for(const N in X){const I=X[N];for(const D in I)u(I[D].object),delete I[D];delete X[N]}}delete i[R]}}function T(R){if(i[R.id]===void 0)return;const O=i[R.id];for(const H in O){const X=O[H];for(const N in X){const I=X[N];for(const D in I)u(I[D].object),delete I[D];delete X[N]}}delete i[R.id]}function C(R){for(const O in i){const H=i[O];for(const X in H){const N=H[X];if(N[R.id]===void 0)continue;const I=N[R.id];for(const D in I)u(I[D].object),delete I[D];delete N[R.id]}}}function v(R){for(const O in i){const H=i[O],X=R.isInstancedMesh===!0?R.id:0,N=H[X];if(N!==void 0){for(const I in N){const D=N[I];for(const W in D)u(D[W].object),delete D[W];delete N[I]}delete H[X],Object.keys(H).length===0&&delete i[O]}}}function A(){L(),o=!0,r!==s&&(r=s,l(r.object))}function L(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:A,resetDefaultState:L,dispose:w,releaseStatesOfGeometry:T,releaseStatesOfObject:v,releaseStatesOfProgram:C,initAttributes:x,enableAttribute:m,disableUnusedAttributes:S}}function ay(n,e,t){let i;function s(c){i=c}function r(c,l){n.drawArrays(i,c,l),t.update(l,i,1)}function o(c,l,u){u!==0&&(n.drawArraysInstanced(i,c,l,u),t.update(l,i,u))}function a(c,l,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,l,0,u);let h=0;for(let f=0;f<u;f++)h+=l[f];t.update(h,i,1)}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a}function cy(n,e,t,i){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const C=e.get("EXT_texture_filter_anisotropic");s=n.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(C){return!(C!==un&&i.convert(C)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(C){const v=C===Zn&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(C!==tn&&i.convert(C)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&C!==ln&&!v)}function c(C){if(C==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp";const u=c(l);u!==l&&(be("WebGLRenderer:",l,"not supported, using",u,"instead."),l=u);const d=t.logarithmicDepthBuffer===!0,h=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&h===!1&&be("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const f=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),g=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),p=n.getParameter(n.MAX_VERTEX_ATTRIBS),S=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),b=n.getParameter(n.MAX_VARYING_VECTORS),y=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),w=n.getParameter(n.MAX_SAMPLES),T=n.getParameter(n.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:a,precision:l,logarithmicDepthBuffer:d,reversedDepthBuffer:h,maxTextures:f,maxVertexTextures:g,maxTextureSize:x,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:S,maxVaryings:b,maxFragmentUniforms:y,maxSamples:w,samples:T}}function ly(n){const e=this;let t=null,i=0,s=!1,r=!1;const o=new xi,a=new Oe,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(d,h){const f=d.length!==0||h||i!==0||s;return s=h,i=d.length,f},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,h){t=u(d,h,0)},this.setState=function(d,h,f){const g=d.clippingPlanes,x=d.clipIntersection,m=d.clipShadows,p=n.get(d);if(!s||g===null||g.length===0||r&&!m)r?u(null):l();else{const S=r?0:i,b=S*4;let y=p.clippingState||null;c.value=y,y=u(g,h,b,f);for(let w=0;w!==b;++w)y[w]=t[w];p.clippingState=y,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=S}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function u(d,h,f,g){const x=d!==null?d.length:0;let m=null;if(x!==0){if(m=c.value,g!==!0||m===null){const p=f+x*4,S=h.matrixWorldInverse;a.getNormalMatrix(S),(m===null||m.length<p)&&(m=new Float32Array(p));for(let b=0,y=f;b!==x;++b,y+=4)o.copy(d[b]).applyMatrix4(S,a),o.normal.toArray(m,y),m[y+3]=o.constant}c.value=m,c.needsUpdate=!0}return e.numPlanes=x,e.numIntersection=0,m}}const ci=4,xu=[.125,.215,.35,.446,.526,.582],Si=20,uy=256,Is=new ao,Mu=new Ne;let jo=null,Yo=0,Ko=0,Jo=!1;const hy=new z;class Su{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,i=.1,s=100,r={}){const{size:o=256,position:a=hy}=r;jo=this._renderer.getRenderTarget(),Yo=this._renderer.getActiveCubeFace(),Ko=this._renderer.getActiveMipmapLevel(),Jo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,i,s,c,a),t>0&&this._blur(c,0,0,t),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Eu(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=bu(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(jo,Yo,Ko),this._renderer.xr.enabled=Jo,e.scissorTest=!1,ji(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===wi||e.mapping===us?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),jo=this._renderer.getRenderTarget(),Yo=this._renderer.getActiveCubeFace(),Ko=this._renderer.getActiveMipmapLevel(),Jo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:Lt,minFilter:Lt,generateMipmaps:!1,type:Zn,format:un,colorSpace:sn,depthBuffer:!1},s=yu(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=yu(e,t,i);const{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=dy(r)),this._blurMaterial=py(r,e,t),this._ggxMaterial=fy(r,e,t)}return s}_compileMaterial(e){const t=new Be(new qt,e);this._renderer.compile(t,Is)}_sceneToCubeUV(e,t,i,s,r){const c=new Zt(90,1,t,i),l=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],d=this._renderer,h=d.autoClear,f=d.toneMapping;d.getClearColor(Mu),d.toneMapping=wn,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(s),d.clearDepth(),d.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Be(new zt,new ai({name:"PMREM.Background",side:jt,depthWrite:!1,depthTest:!1})));const x=this._backgroundBox,m=x.material;let p=!1;const S=e.background;S?S.isColor&&(m.color.copy(S),e.background=null,p=!0):(m.color.copy(Mu),p=!0);for(let b=0;b<6;b++){const y=b%3;y===0?(c.up.set(0,l[b],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x+u[b],r.y,r.z)):y===1?(c.up.set(0,0,l[b]),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y+u[b],r.z)):(c.up.set(0,l[b],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y,r.z+u[b]));const w=this._cubeSize;ji(s,y*w,b>2?w:0,w,w),d.setRenderTarget(s),p&&d.render(x,c),d.render(e,c)}d.toneMapping=f,d.autoClear=h,e.background=S}_textureToCubeUV(e,t){const i=this._renderer,s=e.mapping===wi||e.mapping===us;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Eu()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=bu());const r=s?this._cubemapMaterial:this._equirectMaterial,o=this._lodMeshes[0];o.material=r;const a=r.uniforms;a.envMap.value=e;const c=this._cubeSize;ji(t,0,0,3*c,2*c),i.setRenderTarget(t),i.render(o,Is)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=i}_applyGGXFilter(e,t,i){const s=this._renderer,r=this._pingPongRenderTarget,o=this._ggxMaterial,a=this._lodMeshes[i];a.material=o;const c=o.uniforms,l=i/(this._lodMeshes.length-1),u=t/(this._lodMeshes.length-1),d=Math.sqrt(l*l-u*u),h=0+l*1.25,f=d*h,{_lodMax:g}=this,x=this._sizeLods[i],m=3*x*(i>g-ci?i-g+ci:0),p=4*(this._cubeSize-x);c.envMap.value=e.texture,c.roughness.value=f,c.mipInt.value=g-t,ji(r,m,p,3*x,2*x),s.setRenderTarget(r),s.render(a,Is),c.envMap.value=r.texture,c.roughness.value=0,c.mipInt.value=g-i,ji(e,m,p,3*x,2*x),s.setRenderTarget(e),s.render(a,Is)}_blur(e,t,i,s,r){const o=this._pingPongRenderTarget;this._halfBlur(e,o,t,i,s,"latitudinal",r),this._halfBlur(o,e,i,i,s,"longitudinal",r)}_halfBlur(e,t,i,s,r,o,a){const c=this._renderer,l=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&Pe("blur direction must be either latitudinal or longitudinal!");const u=3,d=this._lodMeshes[s];d.material=l;const h=l.uniforms,f=this._sizeLods[i]-1,g=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*Si-1),x=r/g,m=isFinite(r)?1+Math.floor(u*x):Si;m>Si&&be(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Si}`);const p=[];let S=0;for(let C=0;C<Si;++C){const v=C/x,A=Math.exp(-v*v/2);p.push(A),C===0?S+=A:C<m&&(S+=2*A)}for(let C=0;C<p.length;C++)p[C]=p[C]/S;h.envMap.value=e.texture,h.samples.value=m,h.weights.value=p,h.latitudinal.value=o==="latitudinal",a&&(h.poleAxis.value=a);const{_lodMax:b}=this;h.dTheta.value=g,h.mipInt.value=b-i;const y=this._sizeLods[s],w=3*y*(s>b-ci?s-b+ci:0),T=4*(this._cubeSize-y);ji(t,w,T,3*y,2*y),c.setRenderTarget(t),c.render(d,Is)}}function dy(n){const e=[],t=[],i=[];let s=n;const r=n-ci+1+xu.length;for(let o=0;o<r;o++){const a=Math.pow(2,s);e.push(a);let c=1/a;o>n-ci?c=xu[o-n+ci-1]:o===0&&(c=0),t.push(c);const l=1/(a-2),u=-l,d=1+l,h=[u,u,d,u,d,d,u,u,d,d,u,d],f=6,g=6,x=3,m=2,p=1,S=new Float32Array(x*g*f),b=new Float32Array(m*g*f),y=new Float32Array(p*g*f);for(let T=0;T<f;T++){const C=T%3*2/3-1,v=T>2?0:-1,A=[C,v,0,C+2/3,v,0,C+2/3,v+1,0,C,v,0,C+2/3,v+1,0,C,v+1,0];S.set(A,x*g*T),b.set(h,m*g*T);const L=[T,T,T,T,T,T];y.set(L,p*g*T)}const w=new qt;w.setAttribute("position",new $t(S,x)),w.setAttribute("uv",new $t(b,m)),w.setAttribute("faceIndex",new $t(y,p)),i.push(new Be(w,null)),s>ci&&s--}return{lodMeshes:i,sizeLods:e,sigmas:t}}function yu(n,e,t){const i=new Rn(n,e,t);return i.texture.mapping=io,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function ji(n,e,t,i,s){n.viewport.set(e,t,i,s),n.scissor.set(e,t,i,s)}function fy(n,e,t){return new In({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:uy,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:co(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:Vn,depthTest:!1,depthWrite:!1})}function py(n,e,t){const i=new Float32Array(Si),s=new z(0,1,0);return new In({name:"SphericalGaussianBlur",defines:{n:Si,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:co(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Vn,depthTest:!1,depthWrite:!1})}function bu(){return new In({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:co(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Vn,depthTest:!1,depthWrite:!1})}function Eu(){return new In({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:co(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Vn,depthTest:!1,depthWrite:!1})}function co(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}class Ld extends Rn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},s=[i,i,i,i,i,i];this.texture=new Md(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new zt(5,5,5),r=new In({name:"CubemapFromEquirect",uniforms:fs(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:jt,blending:Vn});r.uniforms.tEquirect.value=t;const o=new Be(s,r),a=t.minFilter;return t.minFilter===Gn&&(t.minFilter=Lt),new hx(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t=!0,i=!0,s=!0){const r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,i,s);e.setRenderTarget(r)}}function my(n){let e=new WeakMap,t=new WeakMap,i=null;function s(h,f=!1){return h==null?null:f?o(h):r(h)}function r(h){if(h&&h.isTexture){const f=h.mapping;if(f===xo||f===Mo)if(e.has(h)){const g=e.get(h).texture;return a(g,h.mapping)}else{const g=h.image;if(g&&g.height>0){const x=new Ld(g.height);return x.fromEquirectangularTexture(n,h),e.set(h,x),h.addEventListener("dispose",l),a(x.texture,h.mapping)}else return null}}return h}function o(h){if(h&&h.isTexture){const f=h.mapping,g=f===xo||f===Mo,x=f===wi||f===us;if(g||x){let m=t.get(h);const p=m!==void 0?m.texture.pmremVersion:0;if(h.isRenderTargetTexture&&h.pmremVersion!==p)return i===null&&(i=new Su(n)),m=g?i.fromEquirectangular(h,m):i.fromCubemap(h,m),m.texture.pmremVersion=h.pmremVersion,t.set(h,m),m.texture;if(m!==void 0)return m.texture;{const S=h.image;return g&&S&&S.height>0||x&&S&&c(S)?(i===null&&(i=new Su(n)),m=g?i.fromEquirectangular(h):i.fromCubemap(h),m.texture.pmremVersion=h.pmremVersion,t.set(h,m),h.addEventListener("dispose",u),m.texture):null}}}return h}function a(h,f){return f===xo?h.mapping=wi:f===Mo&&(h.mapping=us),h}function c(h){let f=0;const g=6;for(let x=0;x<g;x++)h[x]!==void 0&&f++;return f===g}function l(h){const f=h.target;f.removeEventListener("dispose",l);const g=e.get(f);g!==void 0&&(e.delete(f),g.dispose())}function u(h){const f=h.target;f.removeEventListener("dispose",u);const g=t.get(f);g!==void 0&&(t.delete(f),g.dispose())}function d(){e=new WeakMap,t=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:s,dispose:d}}function gy(n){const e={};function t(i){if(e[i]!==void 0)return e[i];const s=n.getExtension(i);return e[i]=s,s}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const s=t(i);return s===null&&oc("WebGLRenderer: "+i+" extension not supported."),s}}}function _y(n,e,t,i){const s={},r=new WeakMap;function o(d){const h=d.target;h.index!==null&&e.remove(h.index);for(const g in h.attributes)e.remove(h.attributes[g]);h.removeEventListener("dispose",o),delete s[h.id];const f=r.get(h);f&&(e.remove(f),r.delete(h)),i.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,t.memory.geometries--}function a(d,h){return s[h.id]===!0||(h.addEventListener("dispose",o),s[h.id]=!0,t.memory.geometries++),h}function c(d){const h=d.attributes;for(const f in h)e.update(h[f],n.ARRAY_BUFFER)}function l(d){const h=[],f=d.index,g=d.attributes.position;let x=0;if(g===void 0)return;if(f!==null){const S=f.array;x=f.version;for(let b=0,y=S.length;b<y;b+=3){const w=S[b+0],T=S[b+1],C=S[b+2];h.push(w,T,T,C,C,w)}}else{const S=g.array;x=g.version;for(let b=0,y=S.length/3-1;b<y;b+=3){const w=b+0,T=b+1,C=b+2;h.push(w,T,T,C,C,w)}}const m=new(g.count>=65535?gd:md)(h,1);m.version=x;const p=r.get(d);p&&e.remove(p),r.set(d,m)}function u(d){const h=r.get(d);if(h){const f=d.index;f!==null&&h.version<f.version&&l(d)}else l(d);return r.get(d)}return{get:a,update:c,getWireframeAttribute:u}}function vy(n,e,t){let i;function s(d){i=d}let r,o;function a(d){r=d.type,o=d.bytesPerElement}function c(d,h){n.drawElements(i,h,r,d*o),t.update(h,i,1)}function l(d,h,f){f!==0&&(n.drawElementsInstanced(i,h,r,d*o,f),t.update(h,i,f))}function u(d,h,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,h,0,r,d,0,f);let x=0;for(let m=0;m<f;m++)x+=h[m];t.update(x,i,1)}this.setMode=s,this.setIndex=a,this.render=c,this.renderInstances=l,this.renderMultiDraw=u}function xy(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,o,a){switch(t.calls++,o){case n.TRIANGLES:t.triangles+=a*(r/3);break;case n.LINES:t.lines+=a*(r/2);break;case n.LINE_STRIP:t.lines+=a*(r-1);break;case n.LINE_LOOP:t.lines+=a*r;break;case n.POINTS:t.points+=a*r;break;default:Pe("WebGLInfo: Unknown draw mode:",o);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:i}}function My(n,e,t){const i=new WeakMap,s=new lt;function r(o,a,c){const l=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,d=u!==void 0?u.length:0;let h=i.get(a);if(h===void 0||h.count!==d){let L=function(){v.dispose(),i.delete(a),a.removeEventListener("dispose",L)};var f=L;h!==void 0&&h.texture.dispose();const g=a.morphAttributes.position!==void 0,x=a.morphAttributes.normal!==void 0,m=a.morphAttributes.color!==void 0,p=a.morphAttributes.position||[],S=a.morphAttributes.normal||[],b=a.morphAttributes.color||[];let y=0;g===!0&&(y=1),x===!0&&(y=2),m===!0&&(y=3);let w=a.attributes.position.count*y,T=1;w>e.maxTextureSize&&(T=Math.ceil(w/e.maxTextureSize),w=e.maxTextureSize);const C=new Float32Array(w*T*4*d),v=new dd(C,w,T,d);v.type=ln,v.needsUpdate=!0;const A=y*4;for(let R=0;R<d;R++){const O=p[R],H=S[R],X=b[R],N=w*T*4*R;for(let I=0;I<O.count;I++){const D=I*A;g===!0&&(s.fromBufferAttribute(O,I),C[N+D+0]=s.x,C[N+D+1]=s.y,C[N+D+2]=s.z,C[N+D+3]=0),x===!0&&(s.fromBufferAttribute(H,I),C[N+D+4]=s.x,C[N+D+5]=s.y,C[N+D+6]=s.z,C[N+D+7]=0),m===!0&&(s.fromBufferAttribute(X,I),C[N+D+8]=s.x,C[N+D+9]=s.y,C[N+D+10]=s.z,C[N+D+11]=X.itemSize===4?s.w:1)}}h={count:d,texture:v,size:new Ye(w,T)},i.set(a,h),a.addEventListener("dispose",L)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(n,"morphTexture",o.morphTexture,t);else{let g=0;for(let m=0;m<l.length;m++)g+=l[m];const x=a.morphTargetsRelative?1:1-g;c.getUniforms().setValue(n,"morphTargetBaseInfluence",x),c.getUniforms().setValue(n,"morphTargetInfluences",l)}c.getUniforms().setValue(n,"morphTargetsTexture",h.texture,t),c.getUniforms().setValue(n,"morphTargetsTextureSize",h.size)}return{update:r}}function Sy(n,e,t,i,s){let r=new WeakMap;function o(l){const u=s.render.frame,d=l.geometry,h=e.get(l,d);if(r.get(h)!==u&&(e.update(h),r.set(h,u)),l.isInstancedMesh&&(l.hasEventListener("dispose",c)===!1&&l.addEventListener("dispose",c),r.get(l)!==u&&(t.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,n.ARRAY_BUFFER),r.set(l,u))),l.isSkinnedMesh){const f=l.skeleton;r.get(f)!==u&&(f.update(),r.set(f,u))}return h}function a(){r=new WeakMap}function c(l){const u=l.target;u.removeEventListener("dispose",c),i.releaseStatesOfObject(u),t.remove(u.instanceMatrix),u.instanceColor!==null&&t.remove(u.instanceColor)}return{update:o,dispose:a}}const yy={[jh]:"LINEAR_TONE_MAPPING",[Yh]:"REINHARD_TONE_MAPPING",[Kh]:"CINEON_TONE_MAPPING",[Jh]:"ACES_FILMIC_TONE_MAPPING",[ed]:"AGX_TONE_MAPPING",[td]:"NEUTRAL_TONE_MAPPING",[Qh]:"CUSTOM_TONE_MAPPING"};function by(n,e,t,i,s){const r=new Rn(e,t,{type:n,depthBuffer:i,stencilBuffer:s,depthTexture:i?new ds(e,t):void 0}),o=new Rn(e,t,{type:Zn,depthBuffer:!1,stencilBuffer:!1}),a=new qt;a.setAttribute("position",new Rt([-1,3,0,-1,-1,0,3,-1,0],3)),a.setAttribute("uv",new Rt([0,2,0,0,2,0],2));const c=new Hv({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),l=new Be(a,c),u=new ao(-1,1,1,-1,0,1);let d=null,h=null,f=!1,g,x=null,m=[],p=!1;this.setSize=function(S,b){r.setSize(S,b),o.setSize(S,b);for(let y=0;y<m.length;y++){const w=m[y];w.setSize&&w.setSize(S,b)}},this.setEffects=function(S){m=S,p=m.length>0&&m[0].isRenderPass===!0;const b=r.width,y=r.height;for(let w=0;w<m.length;w++){const T=m[w];T.setSize&&T.setSize(b,y)}},this.begin=function(S,b){if(f||S.toneMapping===wn&&m.length===0)return!1;if(x=b,b!==null){const y=b.width,w=b.height;(r.width!==y||r.height!==w)&&this.setSize(y,w)}return p===!1&&S.setRenderTarget(r),g=S.toneMapping,S.toneMapping=wn,!0},this.hasRenderPass=function(){return p},this.end=function(S,b){S.toneMapping=g,f=!0;let y=r,w=o;for(let T=0;T<m.length;T++){const C=m[T];if(C.enabled!==!1&&(C.render(S,w,y,b),C.needsSwap!==!1)){const v=y;y=w,w=v}}if(d!==S.outputColorSpace||h!==S.toneMapping){d=S.outputColorSpace,h=S.toneMapping,c.defines={},Ze.getTransfer(d)===Qe&&(c.defines.SRGB_TRANSFER="");const T=yy[h];T&&(c.defines[T]=""),c.needsUpdate=!0}c.uniforms.tDiffuse.value=y.texture,S.setRenderTarget(x),S.render(l,u),x=null,f=!1},this.isCompositing=function(){return f},this.dispose=function(){r.depthTexture&&r.depthTexture.dispose(),r.dispose(),o.dispose(),a.dispose(),c.dispose()}}const Nd=new Nt,lc=new ds(1,1),Dd=new dd,Ud=new hv,Od=new Md,Tu=[],Au=[],wu=new Float32Array(16),Ru=new Float32Array(9),Cu=new Float32Array(4);function ys(n,e,t){const i=n[0];if(i<=0||i>0)return n;const s=e*t;let r=Tu[s];if(r===void 0&&(r=new Float32Array(s),Tu[s]=r),e!==0){i.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,n[o].toArray(r,a)}return r}function Dt(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function Ut(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function lo(n,e){let t=Au[e];t===void 0&&(t=new Int32Array(e),Au[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function Ey(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function Ty(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Dt(t,e))return;n.uniform2fv(this.addr,e),Ut(t,e)}}function Ay(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Dt(t,e))return;n.uniform3fv(this.addr,e),Ut(t,e)}}function wy(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Dt(t,e))return;n.uniform4fv(this.addr,e),Ut(t,e)}}function Ry(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Dt(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),Ut(t,e)}else{if(Dt(t,i))return;Cu.set(i),n.uniformMatrix2fv(this.addr,!1,Cu),Ut(t,i)}}function Cy(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Dt(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),Ut(t,e)}else{if(Dt(t,i))return;Ru.set(i),n.uniformMatrix3fv(this.addr,!1,Ru),Ut(t,i)}}function Py(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Dt(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),Ut(t,e)}else{if(Dt(t,i))return;wu.set(i),n.uniformMatrix4fv(this.addr,!1,wu),Ut(t,i)}}function Iy(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function Ly(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Dt(t,e))return;n.uniform2iv(this.addr,e),Ut(t,e)}}function Ny(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Dt(t,e))return;n.uniform3iv(this.addr,e),Ut(t,e)}}function Dy(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Dt(t,e))return;n.uniform4iv(this.addr,e),Ut(t,e)}}function Uy(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function Oy(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Dt(t,e))return;n.uniform2uiv(this.addr,e),Ut(t,e)}}function Fy(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Dt(t,e))return;n.uniform3uiv(this.addr,e),Ut(t,e)}}function zy(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Dt(t,e))return;n.uniform4uiv(this.addr,e),Ut(t,e)}}function By(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_2D_SHADOW?(lc.compareFunction=t.isReversedDepthBuffer()?Lc:Ic,r=lc):r=Nd,t.setTexture2D(e||r,s)}function ky(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture3D(e||Ud,s)}function Gy(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTextureCube(e||Od,s)}function Hy(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture2DArray(e||Dd,s)}function Vy(n){switch(n){case 5126:return Ey;case 35664:return Ty;case 35665:return Ay;case 35666:return wy;case 35674:return Ry;case 35675:return Cy;case 35676:return Py;case 5124:case 35670:return Iy;case 35667:case 35671:return Ly;case 35668:case 35672:return Ny;case 35669:case 35673:return Dy;case 5125:return Uy;case 36294:return Oy;case 36295:return Fy;case 36296:return zy;case 35678:case 36198:case 36298:case 36306:case 35682:return By;case 35679:case 36299:case 36307:return ky;case 35680:case 36300:case 36308:case 36293:return Gy;case 36289:case 36303:case 36311:case 36292:return Hy}}function Wy(n,e){n.uniform1fv(this.addr,e)}function Xy(n,e){const t=ys(e,this.size,2);n.uniform2fv(this.addr,t)}function Zy(n,e){const t=ys(e,this.size,3);n.uniform3fv(this.addr,t)}function $y(n,e){const t=ys(e,this.size,4);n.uniform4fv(this.addr,t)}function qy(n,e){const t=ys(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function jy(n,e){const t=ys(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function Yy(n,e){const t=ys(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function Ky(n,e){n.uniform1iv(this.addr,e)}function Jy(n,e){n.uniform2iv(this.addr,e)}function Qy(n,e){n.uniform3iv(this.addr,e)}function eb(n,e){n.uniform4iv(this.addr,e)}function tb(n,e){n.uniform1uiv(this.addr,e)}function nb(n,e){n.uniform2uiv(this.addr,e)}function ib(n,e){n.uniform3uiv(this.addr,e)}function sb(n,e){n.uniform4uiv(this.addr,e)}function rb(n,e,t){const i=this.cache,s=e.length,r=lo(t,s);Dt(i,r)||(n.uniform1iv(this.addr,r),Ut(i,r));let o;this.type===n.SAMPLER_2D_SHADOW?o=lc:o=Nd;for(let a=0;a!==s;++a)t.setTexture2D(e[a]||o,r[a])}function ob(n,e,t){const i=this.cache,s=e.length,r=lo(t,s);Dt(i,r)||(n.uniform1iv(this.addr,r),Ut(i,r));for(let o=0;o!==s;++o)t.setTexture3D(e[o]||Ud,r[o])}function ab(n,e,t){const i=this.cache,s=e.length,r=lo(t,s);Dt(i,r)||(n.uniform1iv(this.addr,r),Ut(i,r));for(let o=0;o!==s;++o)t.setTextureCube(e[o]||Od,r[o])}function cb(n,e,t){const i=this.cache,s=e.length,r=lo(t,s);Dt(i,r)||(n.uniform1iv(this.addr,r),Ut(i,r));for(let o=0;o!==s;++o)t.setTexture2DArray(e[o]||Dd,r[o])}function lb(n){switch(n){case 5126:return Wy;case 35664:return Xy;case 35665:return Zy;case 35666:return $y;case 35674:return qy;case 35675:return jy;case 35676:return Yy;case 5124:case 35670:return Ky;case 35667:case 35671:return Jy;case 35668:case 35672:return Qy;case 35669:case 35673:return eb;case 5125:return tb;case 36294:return nb;case 36295:return ib;case 36296:return sb;case 35678:case 36198:case 36298:case 36306:case 35682:return rb;case 35679:case 36299:case 36307:return ob;case 35680:case 36300:case 36308:case 36293:return ab;case 36289:case 36303:case 36311:case 36292:return cb}}class ub{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=Vy(t.type)}}class hb{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=lb(t.type)}}class db{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const s=this.seq;for(let r=0,o=s.length;r!==o;++r){const a=s[r];a.setValue(e,t[a.id],i)}}}const Qo=/(\w+)(\])?(\[|\.)?/g;function Pu(n,e){n.seq.push(e),n.map[e.id]=e}function fb(n,e,t){const i=n.name,s=i.length;for(Qo.lastIndex=0;;){const r=Qo.exec(i),o=Qo.lastIndex;let a=r[1];const c=r[2]==="]",l=r[3];if(c&&(a=a|0),l===void 0||l==="["&&o+2===s){Pu(t,l===void 0?new ub(a,n,e):new hb(a,n,e));break}else{let d=t.map[a];d===void 0&&(d=new db(a),Pu(t,d)),t=d}}}class zr{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let o=0;o<i;++o){const a=e.getActiveUniform(t,o),c=e.getUniformLocation(t,a.name);fb(a,c,this)}const s=[],r=[];for(const o of this.seq)o.type===e.SAMPLER_2D_SHADOW||o.type===e.SAMPLER_CUBE_SHADOW||o.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(o):r.push(o);s.length>0&&(this.seq=s.concat(r))}setValue(e,t,i,s){const r=this.map[t];r!==void 0&&r.setValue(e,i,s)}setOptional(e,t,i){const s=t[i];s!==void 0&&this.setValue(e,i,s)}static upload(e,t,i,s){for(let r=0,o=t.length;r!==o;++r){const a=t[r],c=i[a.id];c.needsUpdate!==!1&&a.setValue(e,c.value,s)}}static seqWithValue(e,t){const i=[];for(let s=0,r=e.length;s!==r;++s){const o=e[s];o.id in t&&i.push(o)}return i}}function Iu(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const pb=37297;let mb=0;function gb(n,e){const t=n.split(`
`),i=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=s;o<r;o++){const a=o+1;i.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return i.join(`
`)}const Lu=new Oe;function _b(n){Ze._getMatrix(Lu,Ze.workingColorSpace,n);const e=`mat3( ${Lu.elements.map(t=>t.toFixed(4))} )`;switch(Ze.getTransfer(n)){case $r:return[e,"LinearTransferOETF"];case Qe:return[e,"sRGBTransferOETF"];default:return be("WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function Nu(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),r=(n.getShaderInfoLog(e)||"").trim();if(i&&r==="")return"";const o=/ERROR: 0:(\d+)/.exec(r);if(o){const a=parseInt(o[1]);return t.toUpperCase()+`

`+r+`

`+gb(n.getShaderSource(e),a)}else return r}function vb(n,e){const t=_b(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}const xb={[jh]:"Linear",[Yh]:"Reinhard",[Kh]:"Cineon",[Jh]:"ACESFilmic",[ed]:"AgX",[td]:"Neutral",[Qh]:"Custom"};function Mb(n,e){const t=xb[e];return t===void 0?(be("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+n+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Cr=new z;function Sb(){Ze.getLuminanceCoefficients(Cr);const n=Cr.x.toFixed(4),e=Cr.y.toFixed(4),t=Cr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function yb(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(zs).join(`
`)}function bb(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function Eb(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const r=n.getActiveAttrib(e,s),o=r.name;let a=1;r.type===n.FLOAT_MAT2&&(a=2),r.type===n.FLOAT_MAT3&&(a=3),r.type===n.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:n.getAttribLocation(e,o),locationSize:a}}return t}function zs(n){return n!==""}function Du(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Uu(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Tb=/^[ \t]*#include +<([\w\d./]+)>/gm;function uc(n){return n.replace(Tb,wb)}const Ab=new Map;function wb(n,e){let t=Ge[e];if(t===void 0){const i=Ab.get(e);if(i!==void 0)t=Ge[i],be('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return uc(t)}const Rb=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Ou(n){return n.replace(Rb,Cb)}function Cb(n,e,t,i){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Fu(n){let e=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	precision ${n.precision} sampler3D;
	precision ${n.precision} sampler2DArray;
	precision ${n.precision} sampler2DShadow;
	precision ${n.precision} samplerCubeShadow;
	precision ${n.precision} sampler2DArrayShadow;
	precision ${n.precision} isampler2D;
	precision ${n.precision} isampler3D;
	precision ${n.precision} isamplerCube;
	precision ${n.precision} isampler2DArray;
	precision ${n.precision} usampler2D;
	precision ${n.precision} usampler3D;
	precision ${n.precision} usamplerCube;
	precision ${n.precision} usampler2DArray;
	`;return n.precision==="highp"?e+=`
#define HIGH_PRECISION`:n.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}const Pb={[Lr]:"SHADOWMAP_TYPE_PCF",[Os]:"SHADOWMAP_TYPE_VSM"};function Ib(n){return Pb[n.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const Lb={[wi]:"ENVMAP_TYPE_CUBE",[us]:"ENVMAP_TYPE_CUBE",[io]:"ENVMAP_TYPE_CUBE_UV"};function Nb(n){return n.envMap===!1?"ENVMAP_TYPE_CUBE":Lb[n.envMapMode]||"ENVMAP_TYPE_CUBE"}const Db={[us]:"ENVMAP_MODE_REFRACTION"};function Ub(n){return n.envMap===!1?"ENVMAP_MODE_REFLECTION":Db[n.envMapMode]||"ENVMAP_MODE_REFLECTION"}const Ob={[qh]:"ENVMAP_BLENDING_MULTIPLY",[T0]:"ENVMAP_BLENDING_MIX",[A0]:"ENVMAP_BLENDING_ADD"};function Fb(n){return n.envMap===!1?"ENVMAP_BLENDING_NONE":Ob[n.combine]||"ENVMAP_BLENDING_NONE"}function zb(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:i,maxMip:t}}function Bb(n,e,t,i){const s=n.getContext(),r=t.defines;let o=t.vertexShader,a=t.fragmentShader;const c=Ib(t),l=Nb(t),u=Ub(t),d=Fb(t),h=zb(t),f=yb(t),g=bb(r),x=s.createProgram();let m,p,S=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(zs).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(zs).join(`
`),p.length>0&&(p+=`
`)):(m=[Fu(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(zs).join(`
`),p=[Fu(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+u:"",t.envMap?"#define "+d:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==wn?"#define TONE_MAPPING":"",t.toneMapping!==wn?Ge.tonemapping_pars_fragment:"",t.toneMapping!==wn?Mb("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ge.colorspace_pars_fragment,vb("linearToOutputTexel",t.outputColorSpace),Sb(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(zs).join(`
`)),o=uc(o),o=Du(o,t),o=Uu(o,t),a=uc(a),a=Du(a,t),a=Uu(a,t),o=Ou(o),a=Ou(a),t.isRawShaderMaterial!==!0&&(S=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",t.glslVersion===Ul?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Ul?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const b=S+m+o,y=S+p+a,w=Iu(s,s.VERTEX_SHADER,b),T=Iu(s,s.FRAGMENT_SHADER,y);s.attachShader(x,w),s.attachShader(x,T),t.index0AttributeName!==void 0?s.bindAttribLocation(x,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(x,0,"position"),s.linkProgram(x);function C(R){if(n.debug.checkShaderErrors){const O=s.getProgramInfoLog(x)||"",H=s.getShaderInfoLog(w)||"",X=s.getShaderInfoLog(T)||"",N=O.trim(),I=H.trim(),D=X.trim();let W=!0,J=!0;if(s.getProgramParameter(x,s.LINK_STATUS)===!1)if(W=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,x,w,T);else{const re=Nu(s,w,"vertex"),_e=Nu(s,T,"fragment");Pe("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(x,s.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+N+`
`+re+`
`+_e)}else N!==""?be("WebGLProgram: Program Info Log:",N):(I===""||D==="")&&(J=!1);J&&(R.diagnostics={runnable:W,programLog:N,vertexShader:{log:I,prefix:m},fragmentShader:{log:D,prefix:p}})}s.deleteShader(w),s.deleteShader(T),v=new zr(s,x),A=Eb(s,x)}let v;this.getUniforms=function(){return v===void 0&&C(this),v};let A;this.getAttributes=function(){return A===void 0&&C(this),A};let L=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return L===!1&&(L=s.getProgramParameter(x,pb)),L},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(x),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=mb++,this.cacheKey=e,this.usedTimes=1,this.program=x,this.vertexShader=w,this.fragmentShader=T,this}let kb=0;class Gb{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(i),o=this._getShaderCacheForMaterial(e);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new Hb(e),t.set(e,i)),i}}class Hb{constructor(e){this.id=kb++,this.code=e,this.usedTimes=0}}function Vb(n){return n===Ri||n===Xr||n===Zr}function Wb(n,e,t,i,s,r){const o=new fd,a=new Gb,c=new Set,l=[],u=new Map,d=i.logarithmicDepthBuffer;let h=i.precision;const f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(v){return c.add(v),v===0?"uv":`uv${v}`}function x(v,A,L,R,O,H){const X=R.fog,N=O.geometry,I=v.isMeshStandardMaterial||v.isMeshLambertMaterial||v.isMeshPhongMaterial?R.environment:null,D=v.isMeshStandardMaterial||v.isMeshLambertMaterial&&!v.envMap||v.isMeshPhongMaterial&&!v.envMap,W=e.get(v.envMap||I,D),J=W&&W.mapping===io?W.image.height:null,re=f[v.type];v.precision!==null&&(h=i.getMaxPrecision(v.precision),h!==v.precision&&be("WebGLProgram.getParameters:",v.precision,"not supported, using",h,"instead."));const _e=N.morphAttributes.position||N.morphAttributes.normal||N.morphAttributes.color,Se=_e!==void 0?_e.length:0;let ve=0;N.morphAttributes.position!==void 0&&(ve=1),N.morphAttributes.normal!==void 0&&(ve=2),N.morphAttributes.color!==void 0&&(ve=3);let Le,Re,q,le;if(re){const Fe=En[re];Le=Fe.vertexShader,Re=Fe.fragmentShader}else Le=v.vertexShader,Re=v.fragmentShader,a.update(v),q=a.getVertexShaderID(v),le=a.getFragmentShaderID(v);const te=n.getRenderTarget(),Ce=n.state.buffers.depth.getReversed(),Ue=O.isInstancedMesh===!0,Ie=O.isBatchedMesh===!0,mt=!!v.map,qe=!!v.matcap,it=!!W,dt=!!v.aoMap,Xe=!!v.lightMap,Ct=!!v.bumpMap,gt=!!v.normalMap,Kt=!!v.displacementMap,U=!!v.emissiveMap,Pt=!!v.metalnessMap,je=!!v.roughnessMap,ut=v.anisotropy>0,ue=v.clearcoat>0,vt=v.dispersion>0,E=v.iridescence>0,_=v.sheen>0,B=v.transmission>0,j=ut&&!!v.anisotropyMap,ee=ue&&!!v.clearcoatMap,ne=ue&&!!v.clearcoatNormalMap,ce=ue&&!!v.clearcoatRoughnessMap,Z=E&&!!v.iridescenceMap,K=E&&!!v.iridescenceThicknessMap,pe=_&&!!v.sheenColorMap,xe=_&&!!v.sheenRoughnessMap,oe=!!v.specularMap,ie=!!v.specularColorMap,De=!!v.specularIntensityMap,ke=B&&!!v.transmissionMap,Je=B&&!!v.thicknessMap,P=!!v.gradientMap,se=!!v.alphaMap,$=v.alphaTest>0,me=!!v.alphaHash,ae=!!v.extensions;let Q=wn;v.toneMapped&&(te===null||te.isXRRenderTarget===!0)&&(Q=n.toneMapping);const Ee={shaderID:re,shaderType:v.type,shaderName:v.name,vertexShader:Le,fragmentShader:Re,defines:v.defines,customVertexShaderID:q,customFragmentShaderID:le,isRawShaderMaterial:v.isRawShaderMaterial===!0,glslVersion:v.glslVersion,precision:h,batching:Ie,batchingColor:Ie&&O._colorsTexture!==null,instancing:Ue,instancingColor:Ue&&O.instanceColor!==null,instancingMorph:Ue&&O.morphTexture!==null,outputColorSpace:te===null?n.outputColorSpace:te.isXRRenderTarget===!0?te.texture.colorSpace:Ze.workingColorSpace,alphaToCoverage:!!v.alphaToCoverage,map:mt,matcap:qe,envMap:it,envMapMode:it&&W.mapping,envMapCubeUVHeight:J,aoMap:dt,lightMap:Xe,bumpMap:Ct,normalMap:gt,displacementMap:Kt,emissiveMap:U,normalMapObjectSpace:gt&&v.normalMapType===I0,normalMapTangentSpace:gt&&v.normalMapType===sc,packedNormalMap:gt&&v.normalMapType===sc&&Vb(v.normalMap.format),metalnessMap:Pt,roughnessMap:je,anisotropy:ut,anisotropyMap:j,clearcoat:ue,clearcoatMap:ee,clearcoatNormalMap:ne,clearcoatRoughnessMap:ce,dispersion:vt,iridescence:E,iridescenceMap:Z,iridescenceThicknessMap:K,sheen:_,sheenColorMap:pe,sheenRoughnessMap:xe,specularMap:oe,specularColorMap:ie,specularIntensityMap:De,transmission:B,transmissionMap:ke,thicknessMap:Je,gradientMap:P,opaque:v.transparent===!1&&v.blending===rs&&v.alphaToCoverage===!1,alphaMap:se,alphaTest:$,alphaHash:me,combine:v.combine,mapUv:mt&&g(v.map.channel),aoMapUv:dt&&g(v.aoMap.channel),lightMapUv:Xe&&g(v.lightMap.channel),bumpMapUv:Ct&&g(v.bumpMap.channel),normalMapUv:gt&&g(v.normalMap.channel),displacementMapUv:Kt&&g(v.displacementMap.channel),emissiveMapUv:U&&g(v.emissiveMap.channel),metalnessMapUv:Pt&&g(v.metalnessMap.channel),roughnessMapUv:je&&g(v.roughnessMap.channel),anisotropyMapUv:j&&g(v.anisotropyMap.channel),clearcoatMapUv:ee&&g(v.clearcoatMap.channel),clearcoatNormalMapUv:ne&&g(v.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ce&&g(v.clearcoatRoughnessMap.channel),iridescenceMapUv:Z&&g(v.iridescenceMap.channel),iridescenceThicknessMapUv:K&&g(v.iridescenceThicknessMap.channel),sheenColorMapUv:pe&&g(v.sheenColorMap.channel),sheenRoughnessMapUv:xe&&g(v.sheenRoughnessMap.channel),specularMapUv:oe&&g(v.specularMap.channel),specularColorMapUv:ie&&g(v.specularColorMap.channel),specularIntensityMapUv:De&&g(v.specularIntensityMap.channel),transmissionMapUv:ke&&g(v.transmissionMap.channel),thicknessMapUv:Je&&g(v.thicknessMap.channel),alphaMapUv:se&&g(v.alphaMap.channel),vertexTangents:!!N.attributes.tangent&&(gt||ut),vertexNormals:!!N.attributes.normal,vertexColors:v.vertexColors,vertexAlphas:v.vertexColors===!0&&!!N.attributes.color&&N.attributes.color.itemSize===4,pointsUvs:O.isPoints===!0&&!!N.attributes.uv&&(mt||se),fog:!!X,useFog:v.fog===!0,fogExp2:!!X&&X.isFogExp2,flatShading:v.wireframe===!1&&(v.flatShading===!0||N.attributes.normal===void 0&&gt===!1&&(v.isMeshLambertMaterial||v.isMeshPhongMaterial||v.isMeshStandardMaterial||v.isMeshPhysicalMaterial)),sizeAttenuation:v.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:Ce,skinning:O.isSkinnedMesh===!0,morphTargets:N.morphAttributes.position!==void 0,morphNormals:N.morphAttributes.normal!==void 0,morphColors:N.morphAttributes.color!==void 0,morphTargetsCount:Se,morphTextureStride:ve,numDirLights:A.directional.length,numPointLights:A.point.length,numSpotLights:A.spot.length,numSpotLightMaps:A.spotLightMap.length,numRectAreaLights:A.rectArea.length,numHemiLights:A.hemi.length,numDirLightShadows:A.directionalShadowMap.length,numPointLightShadows:A.pointShadowMap.length,numSpotLightShadows:A.spotShadowMap.length,numSpotLightShadowsWithMaps:A.numSpotLightShadowsWithMaps,numLightProbes:A.numLightProbes,numLightProbeGrids:H.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:v.dithering,shadowMapEnabled:n.shadowMap.enabled&&L.length>0,shadowMapType:n.shadowMap.type,toneMapping:Q,decodeVideoTexture:mt&&v.map.isVideoTexture===!0&&Ze.getTransfer(v.map.colorSpace)===Qe,decodeVideoTextureEmissive:U&&v.emissiveMap.isVideoTexture===!0&&Ze.getTransfer(v.emissiveMap.colorSpace)===Qe,premultipliedAlpha:v.premultipliedAlpha,doubleSided:v.side===Ft,flipSided:v.side===jt,useDepthPacking:v.depthPacking>=0,depthPacking:v.depthPacking||0,index0AttributeName:v.index0AttributeName,extensionClipCullDistance:ae&&v.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ae&&v.extensions.multiDraw===!0||Ie)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:v.customProgramCacheKey()};return Ee.vertexUv1s=c.has(1),Ee.vertexUv2s=c.has(2),Ee.vertexUv3s=c.has(3),c.clear(),Ee}function m(v){const A=[];if(v.shaderID?A.push(v.shaderID):(A.push(v.customVertexShaderID),A.push(v.customFragmentShaderID)),v.defines!==void 0)for(const L in v.defines)A.push(L),A.push(v.defines[L]);return v.isRawShaderMaterial===!1&&(p(A,v),S(A,v),A.push(n.outputColorSpace)),A.push(v.customProgramCacheKey),A.join()}function p(v,A){v.push(A.precision),v.push(A.outputColorSpace),v.push(A.envMapMode),v.push(A.envMapCubeUVHeight),v.push(A.mapUv),v.push(A.alphaMapUv),v.push(A.lightMapUv),v.push(A.aoMapUv),v.push(A.bumpMapUv),v.push(A.normalMapUv),v.push(A.displacementMapUv),v.push(A.emissiveMapUv),v.push(A.metalnessMapUv),v.push(A.roughnessMapUv),v.push(A.anisotropyMapUv),v.push(A.clearcoatMapUv),v.push(A.clearcoatNormalMapUv),v.push(A.clearcoatRoughnessMapUv),v.push(A.iridescenceMapUv),v.push(A.iridescenceThicknessMapUv),v.push(A.sheenColorMapUv),v.push(A.sheenRoughnessMapUv),v.push(A.specularMapUv),v.push(A.specularColorMapUv),v.push(A.specularIntensityMapUv),v.push(A.transmissionMapUv),v.push(A.thicknessMapUv),v.push(A.combine),v.push(A.fogExp2),v.push(A.sizeAttenuation),v.push(A.morphTargetsCount),v.push(A.morphAttributeCount),v.push(A.numDirLights),v.push(A.numPointLights),v.push(A.numSpotLights),v.push(A.numSpotLightMaps),v.push(A.numHemiLights),v.push(A.numRectAreaLights),v.push(A.numDirLightShadows),v.push(A.numPointLightShadows),v.push(A.numSpotLightShadows),v.push(A.numSpotLightShadowsWithMaps),v.push(A.numLightProbes),v.push(A.shadowMapType),v.push(A.toneMapping),v.push(A.numClippingPlanes),v.push(A.numClipIntersection),v.push(A.depthPacking)}function S(v,A){o.disableAll(),A.instancing&&o.enable(0),A.instancingColor&&o.enable(1),A.instancingMorph&&o.enable(2),A.matcap&&o.enable(3),A.envMap&&o.enable(4),A.normalMapObjectSpace&&o.enable(5),A.normalMapTangentSpace&&o.enable(6),A.clearcoat&&o.enable(7),A.iridescence&&o.enable(8),A.alphaTest&&o.enable(9),A.vertexColors&&o.enable(10),A.vertexAlphas&&o.enable(11),A.vertexUv1s&&o.enable(12),A.vertexUv2s&&o.enable(13),A.vertexUv3s&&o.enable(14),A.vertexTangents&&o.enable(15),A.anisotropy&&o.enable(16),A.alphaHash&&o.enable(17),A.batching&&o.enable(18),A.dispersion&&o.enable(19),A.batchingColor&&o.enable(20),A.gradientMap&&o.enable(21),A.packedNormalMap&&o.enable(22),A.vertexNormals&&o.enable(23),v.push(o.mask),o.disableAll(),A.fog&&o.enable(0),A.useFog&&o.enable(1),A.flatShading&&o.enable(2),A.logarithmicDepthBuffer&&o.enable(3),A.reversedDepthBuffer&&o.enable(4),A.skinning&&o.enable(5),A.morphTargets&&o.enable(6),A.morphNormals&&o.enable(7),A.morphColors&&o.enable(8),A.premultipliedAlpha&&o.enable(9),A.shadowMapEnabled&&o.enable(10),A.doubleSided&&o.enable(11),A.flipSided&&o.enable(12),A.useDepthPacking&&o.enable(13),A.dithering&&o.enable(14),A.transmission&&o.enable(15),A.sheen&&o.enable(16),A.opaque&&o.enable(17),A.pointsUvs&&o.enable(18),A.decodeVideoTexture&&o.enable(19),A.decodeVideoTextureEmissive&&o.enable(20),A.alphaToCoverage&&o.enable(21),A.numLightProbeGrids>0&&o.enable(22),v.push(o.mask)}function b(v){const A=f[v.type];let L;if(A){const R=En[A];L=Bv.clone(R.uniforms)}else L=v.uniforms;return L}function y(v,A){let L=u.get(A);return L!==void 0?++L.usedTimes:(L=new Bb(n,A,v,s),l.push(L),u.set(A,L)),L}function w(v){if(--v.usedTimes===0){const A=l.indexOf(v);l[A]=l[l.length-1],l.pop(),u.delete(v.cacheKey),v.destroy()}}function T(v){a.remove(v)}function C(){a.dispose()}return{getParameters:x,getProgramCacheKey:m,getUniforms:b,acquireProgram:y,releaseProgram:w,releaseShaderCache:T,programs:l,dispose:C}}function Xb(){let n=new WeakMap;function e(o){return n.has(o)}function t(o){let a=n.get(o);return a===void 0&&(a={},n.set(o,a)),a}function i(o){n.delete(o)}function s(o,a,c){n.get(o)[a]=c}function r(){n=new WeakMap}return{has:e,get:t,remove:i,update:s,dispose:r}}function Zb(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.materialVariant!==e.materialVariant?n.materialVariant-e.materialVariant:n.z!==e.z?n.z-e.z:n.id-e.id}function zu(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function Bu(){const n=[];let e=0;const t=[],i=[],s=[];function r(){e=0,t.length=0,i.length=0,s.length=0}function o(h){let f=0;return h.isInstancedMesh&&(f+=2),h.isSkinnedMesh&&(f+=1),f}function a(h,f,g,x,m,p){let S=n[e];return S===void 0?(S={id:h.id,object:h,geometry:f,material:g,materialVariant:o(h),groupOrder:x,renderOrder:h.renderOrder,z:m,group:p},n[e]=S):(S.id=h.id,S.object=h,S.geometry=f,S.material=g,S.materialVariant=o(h),S.groupOrder=x,S.renderOrder=h.renderOrder,S.z=m,S.group=p),e++,S}function c(h,f,g,x,m,p){const S=a(h,f,g,x,m,p);g.transmission>0?i.push(S):g.transparent===!0?s.push(S):t.push(S)}function l(h,f,g,x,m,p){const S=a(h,f,g,x,m,p);g.transmission>0?i.unshift(S):g.transparent===!0?s.unshift(S):t.unshift(S)}function u(h,f){t.length>1&&t.sort(h||Zb),i.length>1&&i.sort(f||zu),s.length>1&&s.sort(f||zu)}function d(){for(let h=e,f=n.length;h<f;h++){const g=n[h];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:t,transmissive:i,transparent:s,init:r,push:c,unshift:l,finish:d,sort:u}}function $b(){let n=new WeakMap;function e(i,s){const r=n.get(i);let o;return r===void 0?(o=new Bu,n.set(i,[o])):s>=r.length?(o=new Bu,r.push(o)):o=r[s],o}function t(){n=new WeakMap}return{get:e,dispose:t}}function qb(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new z,color:new Ne};break;case"SpotLight":t={position:new z,direction:new z,color:new Ne,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new z,color:new Ne,distance:0,decay:0};break;case"HemisphereLight":t={direction:new z,skyColor:new Ne,groundColor:new Ne};break;case"RectAreaLight":t={color:new Ne,position:new z,halfWidth:new z,halfHeight:new z};break}return n[e.id]=t,t}}}function jb(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ye};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ye};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ye,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let Yb=0;function Kb(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function Jb(n){const e=new qb,t=jb(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)i.probe.push(new z);const s=new z,r=new He,o=new He;function a(l){let u=0,d=0,h=0;for(let A=0;A<9;A++)i.probe[A].set(0,0,0);let f=0,g=0,x=0,m=0,p=0,S=0,b=0,y=0,w=0,T=0,C=0;l.sort(Kb);for(let A=0,L=l.length;A<L;A++){const R=l[A],O=R.color,H=R.intensity,X=R.distance;let N=null;if(R.shadow&&R.shadow.map&&(R.shadow.map.texture.format===Ri?N=R.shadow.map.texture:N=R.shadow.map.depthTexture||R.shadow.map.texture),R.isAmbientLight)u+=O.r*H,d+=O.g*H,h+=O.b*H;else if(R.isLightProbe){for(let I=0;I<9;I++)i.probe[I].addScaledVector(R.sh.coefficients[I],H);C++}else if(R.isDirectionalLight){const I=e.get(R);if(I.color.copy(R.color).multiplyScalar(R.intensity),R.castShadow){const D=R.shadow,W=t.get(R);W.shadowIntensity=D.intensity,W.shadowBias=D.bias,W.shadowNormalBias=D.normalBias,W.shadowRadius=D.radius,W.shadowMapSize=D.mapSize,i.directionalShadow[f]=W,i.directionalShadowMap[f]=N,i.directionalShadowMatrix[f]=R.shadow.matrix,S++}i.directional[f]=I,f++}else if(R.isSpotLight){const I=e.get(R);I.position.setFromMatrixPosition(R.matrixWorld),I.color.copy(O).multiplyScalar(H),I.distance=X,I.coneCos=Math.cos(R.angle),I.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),I.decay=R.decay,i.spot[x]=I;const D=R.shadow;if(R.map&&(i.spotLightMap[w]=R.map,w++,D.updateMatrices(R),R.castShadow&&T++),i.spotLightMatrix[x]=D.matrix,R.castShadow){const W=t.get(R);W.shadowIntensity=D.intensity,W.shadowBias=D.bias,W.shadowNormalBias=D.normalBias,W.shadowRadius=D.radius,W.shadowMapSize=D.mapSize,i.spotShadow[x]=W,i.spotShadowMap[x]=N,y++}x++}else if(R.isRectAreaLight){const I=e.get(R);I.color.copy(O).multiplyScalar(H),I.halfWidth.set(R.width*.5,0,0),I.halfHeight.set(0,R.height*.5,0),i.rectArea[m]=I,m++}else if(R.isPointLight){const I=e.get(R);if(I.color.copy(R.color).multiplyScalar(R.intensity),I.distance=R.distance,I.decay=R.decay,R.castShadow){const D=R.shadow,W=t.get(R);W.shadowIntensity=D.intensity,W.shadowBias=D.bias,W.shadowNormalBias=D.normalBias,W.shadowRadius=D.radius,W.shadowMapSize=D.mapSize,W.shadowCameraNear=D.camera.near,W.shadowCameraFar=D.camera.far,i.pointShadow[g]=W,i.pointShadowMap[g]=N,i.pointShadowMatrix[g]=R.shadow.matrix,b++}i.point[g]=I,g++}else if(R.isHemisphereLight){const I=e.get(R);I.skyColor.copy(R.color).multiplyScalar(H),I.groundColor.copy(R.groundColor).multiplyScalar(H),i.hemi[p]=I,p++}}m>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=he.LTC_FLOAT_1,i.rectAreaLTC2=he.LTC_FLOAT_2):(i.rectAreaLTC1=he.LTC_HALF_1,i.rectAreaLTC2=he.LTC_HALF_2)),i.ambient[0]=u,i.ambient[1]=d,i.ambient[2]=h;const v=i.hash;(v.directionalLength!==f||v.pointLength!==g||v.spotLength!==x||v.rectAreaLength!==m||v.hemiLength!==p||v.numDirectionalShadows!==S||v.numPointShadows!==b||v.numSpotShadows!==y||v.numSpotMaps!==w||v.numLightProbes!==C)&&(i.directional.length=f,i.spot.length=x,i.rectArea.length=m,i.point.length=g,i.hemi.length=p,i.directionalShadow.length=S,i.directionalShadowMap.length=S,i.pointShadow.length=b,i.pointShadowMap.length=b,i.spotShadow.length=y,i.spotShadowMap.length=y,i.directionalShadowMatrix.length=S,i.pointShadowMatrix.length=b,i.spotLightMatrix.length=y+w-T,i.spotLightMap.length=w,i.numSpotLightShadowsWithMaps=T,i.numLightProbes=C,v.directionalLength=f,v.pointLength=g,v.spotLength=x,v.rectAreaLength=m,v.hemiLength=p,v.numDirectionalShadows=S,v.numPointShadows=b,v.numSpotShadows=y,v.numSpotMaps=w,v.numLightProbes=C,i.version=Yb++)}function c(l,u){let d=0,h=0,f=0,g=0,x=0;const m=u.matrixWorldInverse;for(let p=0,S=l.length;p<S;p++){const b=l[p];if(b.isDirectionalLight){const y=i.directional[d];y.direction.setFromMatrixPosition(b.matrixWorld),s.setFromMatrixPosition(b.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(m),d++}else if(b.isSpotLight){const y=i.spot[f];y.position.setFromMatrixPosition(b.matrixWorld),y.position.applyMatrix4(m),y.direction.setFromMatrixPosition(b.matrixWorld),s.setFromMatrixPosition(b.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(m),f++}else if(b.isRectAreaLight){const y=i.rectArea[g];y.position.setFromMatrixPosition(b.matrixWorld),y.position.applyMatrix4(m),o.identity(),r.copy(b.matrixWorld),r.premultiply(m),o.extractRotation(r),y.halfWidth.set(b.width*.5,0,0),y.halfHeight.set(0,b.height*.5,0),y.halfWidth.applyMatrix4(o),y.halfHeight.applyMatrix4(o),g++}else if(b.isPointLight){const y=i.point[h];y.position.setFromMatrixPosition(b.matrixWorld),y.position.applyMatrix4(m),h++}else if(b.isHemisphereLight){const y=i.hemi[x];y.direction.setFromMatrixPosition(b.matrixWorld),y.direction.transformDirection(m),x++}}}return{setup:a,setupView:c,state:i}}function ku(n){const e=new Jb(n),t=[],i=[],s=[];function r(h){d.camera=h,t.length=0,i.length=0,s.length=0}function o(h){t.push(h)}function a(h){i.push(h)}function c(h){s.push(h)}function l(){e.setup(t)}function u(h){e.setupView(t,h)}const d={lightsArray:t,shadowsArray:i,lightProbeGridArray:s,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:d,setupLights:l,setupLightsView:u,pushLight:o,pushShadow:a,pushLightProbeGrid:c}}function Qb(n){let e=new WeakMap;function t(s,r=0){const o=e.get(s);let a;return o===void 0?(a=new ku(n),e.set(s,[a])):r>=o.length?(a=new ku(n),o.push(a)):a=o[r],a}function i(){e=new WeakMap}return{get:t,dispose:i}}const eE=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,tE=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,nE=[new z(1,0,0),new z(-1,0,0),new z(0,1,0),new z(0,-1,0),new z(0,0,1),new z(0,0,-1)],iE=[new z(0,-1,0),new z(0,-1,0),new z(0,0,1),new z(0,0,-1),new z(0,-1,0),new z(0,-1,0)],Gu=new He,Ls=new z,ea=new z;function sE(n,e,t){let i=new Bc;const s=new Ye,r=new Ye,o=new lt,a=new Vv,c=new Wv,l={},u=t.maxTextureSize,d={[Xn]:jt,[jt]:Xn,[Ft]:Ft},h=new In({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ye},radius:{value:4}},vertexShader:eE,fragmentShader:tE}),f=h.clone();f.defines.HORIZONTAL_PASS=1;const g=new qt;g.setAttribute("position",new $t(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const x=new Be(g,h),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Lr;let p=this.type;this.render=function(T,C,v){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||T.length===0)return;this.type===o0&&(be("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=Lr);const A=n.getRenderTarget(),L=n.getActiveCubeFace(),R=n.getActiveMipmapLevel(),O=n.state;O.setBlending(Vn),O.buffers.depth.getReversed()===!0?O.buffers.color.setClear(0,0,0,0):O.buffers.color.setClear(1,1,1,1),O.buffers.depth.setTest(!0),O.setScissorTest(!1);const H=p!==this.type;H&&C.traverse(function(X){X.material&&(Array.isArray(X.material)?X.material.forEach(N=>N.needsUpdate=!0):X.material.needsUpdate=!0)});for(let X=0,N=T.length;X<N;X++){const I=T[X],D=I.shadow;if(D===void 0){be("WebGLShadowMap:",I,"has no shadow.");continue}if(D.autoUpdate===!1&&D.needsUpdate===!1)continue;s.copy(D.mapSize);const W=D.getFrameExtents();s.multiply(W),r.copy(D.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/W.x),s.x=r.x*W.x,D.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/W.y),s.y=r.y*W.y,D.mapSize.y=r.y));const J=n.state.buffers.depth.getReversed();if(D.camera._reversedDepth=J,D.map===null||H===!0){if(D.map!==null&&(D.map.depthTexture!==null&&(D.map.depthTexture.dispose(),D.map.depthTexture=null),D.map.dispose()),this.type===Os){if(I.isPointLight){be("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}D.map=new Rn(s.x,s.y,{format:Ri,type:Zn,minFilter:Lt,magFilter:Lt,generateMipmaps:!1}),D.map.texture.name=I.name+".shadowMap",D.map.depthTexture=new ds(s.x,s.y,ln),D.map.depthTexture.name=I.name+".shadowMapDepth",D.map.depthTexture.format=$n,D.map.depthTexture.compareFunction=null,D.map.depthTexture.minFilter=It,D.map.depthTexture.magFilter=It}else I.isPointLight?(D.map=new Ld(s.x),D.map.depthTexture=new Fv(s.x,Pn)):(D.map=new Rn(s.x,s.y),D.map.depthTexture=new ds(s.x,s.y,Pn)),D.map.depthTexture.name=I.name+".shadowMap",D.map.depthTexture.format=$n,this.type===Lr?(D.map.depthTexture.compareFunction=J?Lc:Ic,D.map.depthTexture.minFilter=Lt,D.map.depthTexture.magFilter=Lt):(D.map.depthTexture.compareFunction=null,D.map.depthTexture.minFilter=It,D.map.depthTexture.magFilter=It);D.camera.updateProjectionMatrix()}const re=D.map.isWebGLCubeRenderTarget?6:1;for(let _e=0;_e<re;_e++){if(D.map.isWebGLCubeRenderTarget)n.setRenderTarget(D.map,_e),n.clear();else{_e===0&&(n.setRenderTarget(D.map),n.clear());const Se=D.getViewport(_e);o.set(r.x*Se.x,r.y*Se.y,r.x*Se.z,r.y*Se.w),O.viewport(o)}if(I.isPointLight){const Se=D.camera,ve=D.matrix,Le=I.distance||Se.far;Le!==Se.far&&(Se.far=Le,Se.updateProjectionMatrix()),Ls.setFromMatrixPosition(I.matrixWorld),Se.position.copy(Ls),ea.copy(Se.position),ea.add(nE[_e]),Se.up.copy(iE[_e]),Se.lookAt(ea),Se.updateMatrixWorld(),ve.makeTranslation(-Ls.x,-Ls.y,-Ls.z),Gu.multiplyMatrices(Se.projectionMatrix,Se.matrixWorldInverse),D._frustum.setFromProjectionMatrix(Gu,Se.coordinateSystem,Se.reversedDepth)}else D.updateMatrices(I);i=D.getFrustum(),y(C,v,D.camera,I,this.type)}D.isPointLightShadow!==!0&&this.type===Os&&S(D,v),D.needsUpdate=!1}p=this.type,m.needsUpdate=!1,n.setRenderTarget(A,L,R)};function S(T,C){const v=e.update(x);h.defines.VSM_SAMPLES!==T.blurSamples&&(h.defines.VSM_SAMPLES=T.blurSamples,f.defines.VSM_SAMPLES=T.blurSamples,h.needsUpdate=!0,f.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new Rn(s.x,s.y,{format:Ri,type:Zn})),h.uniforms.shadow_pass.value=T.map.depthTexture,h.uniforms.resolution.value=T.mapSize,h.uniforms.radius.value=T.radius,n.setRenderTarget(T.mapPass),n.clear(),n.renderBufferDirect(C,null,v,h,x,null),f.uniforms.shadow_pass.value=T.mapPass.texture,f.uniforms.resolution.value=T.mapSize,f.uniforms.radius.value=T.radius,n.setRenderTarget(T.map),n.clear(),n.renderBufferDirect(C,null,v,f,x,null)}function b(T,C,v,A){let L=null;const R=v.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(R!==void 0)L=R;else if(L=v.isPointLight===!0?c:a,n.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0||C.alphaToCoverage===!0){const O=L.uuid,H=C.uuid;let X=l[O];X===void 0&&(X={},l[O]=X);let N=X[H];N===void 0&&(N=L.clone(),X[H]=N,C.addEventListener("dispose",w)),L=N}if(L.visible=C.visible,L.wireframe=C.wireframe,A===Os?L.side=C.shadowSide!==null?C.shadowSide:C.side:L.side=C.shadowSide!==null?C.shadowSide:d[C.side],L.alphaMap=C.alphaMap,L.alphaTest=C.alphaToCoverage===!0?.5:C.alphaTest,L.map=C.map,L.clipShadows=C.clipShadows,L.clippingPlanes=C.clippingPlanes,L.clipIntersection=C.clipIntersection,L.displacementMap=C.displacementMap,L.displacementScale=C.displacementScale,L.displacementBias=C.displacementBias,L.wireframeLinewidth=C.wireframeLinewidth,L.linewidth=C.linewidth,v.isPointLight===!0&&L.isMeshDistanceMaterial===!0){const O=n.properties.get(L);O.light=v}return L}function y(T,C,v,A,L){if(T.visible===!1)return;if(T.layers.test(C.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&L===Os)&&(!T.frustumCulled||i.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(v.matrixWorldInverse,T.matrixWorld);const H=e.update(T),X=T.material;if(Array.isArray(X)){const N=H.groups;for(let I=0,D=N.length;I<D;I++){const W=N[I],J=X[W.materialIndex];if(J&&J.visible){const re=b(T,J,A,L);T.onBeforeShadow(n,T,C,v,H,re,W),n.renderBufferDirect(v,null,H,re,T,W),T.onAfterShadow(n,T,C,v,H,re,W)}}}else if(X.visible){const N=b(T,X,A,L);T.onBeforeShadow(n,T,C,v,H,N,null),n.renderBufferDirect(v,null,H,N,T,null),T.onAfterShadow(n,T,C,v,H,N,null)}}const O=T.children;for(let H=0,X=O.length;H<X;H++)y(O[H],C,v,A,L)}function w(T){T.target.removeEventListener("dispose",w);for(const v in l){const A=l[v],L=T.target.uuid;L in A&&(A[L].dispose(),delete A[L])}}}function rE(n,e){function t(){let P=!1;const se=new lt;let $=null;const me=new lt(0,0,0,0);return{setMask:function(ae){$!==ae&&!P&&(n.colorMask(ae,ae,ae,ae),$=ae)},setLocked:function(ae){P=ae},setClear:function(ae,Q,Ee,Fe,Mt){Mt===!0&&(ae*=Fe,Q*=Fe,Ee*=Fe),se.set(ae,Q,Ee,Fe),me.equals(se)===!1&&(n.clearColor(ae,Q,Ee,Fe),me.copy(se))},reset:function(){P=!1,$=null,me.set(-1,0,0,0)}}}function i(){let P=!1,se=!1,$=null,me=null,ae=null;return{setReversed:function(Q){if(se!==Q){const Ee=e.get("EXT_clip_control");Q?Ee.clipControlEXT(Ee.LOWER_LEFT_EXT,Ee.ZERO_TO_ONE_EXT):Ee.clipControlEXT(Ee.LOWER_LEFT_EXT,Ee.NEGATIVE_ONE_TO_ONE_EXT),se=Q;const Fe=ae;ae=null,this.setClear(Fe)}},getReversed:function(){return se},setTest:function(Q){Q?te(n.DEPTH_TEST):Ce(n.DEPTH_TEST)},setMask:function(Q){$!==Q&&!P&&(n.depthMask(Q),$=Q)},setFunc:function(Q){if(se&&(Q=H0[Q]),me!==Q){switch(Q){case Ma:n.depthFunc(n.NEVER);break;case Sa:n.depthFunc(n.ALWAYS);break;case ya:n.depthFunc(n.LESS);break;case ls:n.depthFunc(n.LEQUAL);break;case ba:n.depthFunc(n.EQUAL);break;case Ea:n.depthFunc(n.GEQUAL);break;case Ta:n.depthFunc(n.GREATER);break;case Aa:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}me=Q}},setLocked:function(Q){P=Q},setClear:function(Q){ae!==Q&&(ae=Q,se&&(Q=1-Q),n.clearDepth(Q))},reset:function(){P=!1,$=null,me=null,ae=null,se=!1}}}function s(){let P=!1,se=null,$=null,me=null,ae=null,Q=null,Ee=null,Fe=null,Mt=null;return{setTest:function(st){P||(st?te(n.STENCIL_TEST):Ce(n.STENCIL_TEST))},setMask:function(st){se!==st&&!P&&(n.stencilMask(st),se=st)},setFunc:function(st,Dn,xn){($!==st||me!==Dn||ae!==xn)&&(n.stencilFunc(st,Dn,xn),$=st,me=Dn,ae=xn)},setOp:function(st,Dn,xn){(Q!==st||Ee!==Dn||Fe!==xn)&&(n.stencilOp(st,Dn,xn),Q=st,Ee=Dn,Fe=xn)},setLocked:function(st){P=st},setClear:function(st){Mt!==st&&(n.clearStencil(st),Mt=st)},reset:function(){P=!1,se=null,$=null,me=null,ae=null,Q=null,Ee=null,Fe=null,Mt=null}}}const r=new t,o=new i,a=new s,c=new WeakMap,l=new WeakMap;let u={},d={},h={},f=new WeakMap,g=[],x=null,m=!1,p=null,S=null,b=null,y=null,w=null,T=null,C=null,v=new Ne(0,0,0),A=0,L=!1,R=null,O=null,H=null,X=null,N=null;const I=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let D=!1,W=0;const J=n.getParameter(n.VERSION);J.indexOf("WebGL")!==-1?(W=parseFloat(/^WebGL (\d)/.exec(J)[1]),D=W>=1):J.indexOf("OpenGL ES")!==-1&&(W=parseFloat(/^OpenGL ES (\d)/.exec(J)[1]),D=W>=2);let re=null,_e={};const Se=n.getParameter(n.SCISSOR_BOX),ve=n.getParameter(n.VIEWPORT),Le=new lt().fromArray(Se),Re=new lt().fromArray(ve);function q(P,se,$,me){const ae=new Uint8Array(4),Q=n.createTexture();n.bindTexture(P,Q),n.texParameteri(P,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(P,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Ee=0;Ee<$;Ee++)P===n.TEXTURE_3D||P===n.TEXTURE_2D_ARRAY?n.texImage3D(se,0,n.RGBA,1,1,me,0,n.RGBA,n.UNSIGNED_BYTE,ae):n.texImage2D(se+Ee,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,ae);return Q}const le={};le[n.TEXTURE_2D]=q(n.TEXTURE_2D,n.TEXTURE_2D,1),le[n.TEXTURE_CUBE_MAP]=q(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),le[n.TEXTURE_2D_ARRAY]=q(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),le[n.TEXTURE_3D]=q(n.TEXTURE_3D,n.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),te(n.DEPTH_TEST),o.setFunc(ls),Ct(!1),gt(Tl),te(n.CULL_FACE),dt(Vn);function te(P){u[P]!==!0&&(n.enable(P),u[P]=!0)}function Ce(P){u[P]!==!1&&(n.disable(P),u[P]=!1)}function Ue(P,se){return h[P]!==se?(n.bindFramebuffer(P,se),h[P]=se,P===n.DRAW_FRAMEBUFFER&&(h[n.FRAMEBUFFER]=se),P===n.FRAMEBUFFER&&(h[n.DRAW_FRAMEBUFFER]=se),!0):!1}function Ie(P,se){let $=g,me=!1;if(P){$=f.get(se),$===void 0&&($=[],f.set(se,$));const ae=P.textures;if($.length!==ae.length||$[0]!==n.COLOR_ATTACHMENT0){for(let Q=0,Ee=ae.length;Q<Ee;Q++)$[Q]=n.COLOR_ATTACHMENT0+Q;$.length=ae.length,me=!0}}else $[0]!==n.BACK&&($[0]=n.BACK,me=!0);me&&n.drawBuffers($)}function mt(P){return x!==P?(n.useProgram(P),x=P,!0):!1}const qe={[Mi]:n.FUNC_ADD,[c0]:n.FUNC_SUBTRACT,[l0]:n.FUNC_REVERSE_SUBTRACT};qe[u0]=n.MIN,qe[h0]=n.MAX;const it={[d0]:n.ZERO,[f0]:n.ONE,[p0]:n.SRC_COLOR,[va]:n.SRC_ALPHA,[M0]:n.SRC_ALPHA_SATURATE,[v0]:n.DST_COLOR,[g0]:n.DST_ALPHA,[m0]:n.ONE_MINUS_SRC_COLOR,[xa]:n.ONE_MINUS_SRC_ALPHA,[x0]:n.ONE_MINUS_DST_COLOR,[_0]:n.ONE_MINUS_DST_ALPHA,[S0]:n.CONSTANT_COLOR,[y0]:n.ONE_MINUS_CONSTANT_COLOR,[b0]:n.CONSTANT_ALPHA,[E0]:n.ONE_MINUS_CONSTANT_ALPHA};function dt(P,se,$,me,ae,Q,Ee,Fe,Mt,st){if(P===Vn){m===!0&&(Ce(n.BLEND),m=!1);return}if(m===!1&&(te(n.BLEND),m=!0),P!==a0){if(P!==p||st!==L){if((S!==Mi||w!==Mi)&&(n.blendEquation(n.FUNC_ADD),S=Mi,w=Mi),st)switch(P){case rs:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Al:n.blendFunc(n.ONE,n.ONE);break;case wl:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Rl:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:Pe("WebGLState: Invalid blending: ",P);break}else switch(P){case rs:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Al:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case wl:Pe("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Rl:Pe("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Pe("WebGLState: Invalid blending: ",P);break}b=null,y=null,T=null,C=null,v.set(0,0,0),A=0,p=P,L=st}return}ae=ae||se,Q=Q||$,Ee=Ee||me,(se!==S||ae!==w)&&(n.blendEquationSeparate(qe[se],qe[ae]),S=se,w=ae),($!==b||me!==y||Q!==T||Ee!==C)&&(n.blendFuncSeparate(it[$],it[me],it[Q],it[Ee]),b=$,y=me,T=Q,C=Ee),(Fe.equals(v)===!1||Mt!==A)&&(n.blendColor(Fe.r,Fe.g,Fe.b,Mt),v.copy(Fe),A=Mt),p=P,L=!1}function Xe(P,se){P.side===Ft?Ce(n.CULL_FACE):te(n.CULL_FACE);let $=P.side===jt;se&&($=!$),Ct($),P.blending===rs&&P.transparent===!1?dt(Vn):dt(P.blending,P.blendEquation,P.blendSrc,P.blendDst,P.blendEquationAlpha,P.blendSrcAlpha,P.blendDstAlpha,P.blendColor,P.blendAlpha,P.premultipliedAlpha),o.setFunc(P.depthFunc),o.setTest(P.depthTest),o.setMask(P.depthWrite),r.setMask(P.colorWrite);const me=P.stencilWrite;a.setTest(me),me&&(a.setMask(P.stencilWriteMask),a.setFunc(P.stencilFunc,P.stencilRef,P.stencilFuncMask),a.setOp(P.stencilFail,P.stencilZFail,P.stencilZPass)),U(P.polygonOffset,P.polygonOffsetFactor,P.polygonOffsetUnits),P.alphaToCoverage===!0?te(n.SAMPLE_ALPHA_TO_COVERAGE):Ce(n.SAMPLE_ALPHA_TO_COVERAGE)}function Ct(P){R!==P&&(P?n.frontFace(n.CW):n.frontFace(n.CCW),R=P)}function gt(P){P!==s0?(te(n.CULL_FACE),P!==O&&(P===Tl?n.cullFace(n.BACK):P===r0?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):Ce(n.CULL_FACE),O=P}function Kt(P){P!==H&&(D&&n.lineWidth(P),H=P)}function U(P,se,$){P?(te(n.POLYGON_OFFSET_FILL),(X!==se||N!==$)&&(X=se,N=$,o.getReversed()&&(se=-se),n.polygonOffset(se,$))):Ce(n.POLYGON_OFFSET_FILL)}function Pt(P){P?te(n.SCISSOR_TEST):Ce(n.SCISSOR_TEST)}function je(P){P===void 0&&(P=n.TEXTURE0+I-1),re!==P&&(n.activeTexture(P),re=P)}function ut(P,se,$){$===void 0&&(re===null?$=n.TEXTURE0+I-1:$=re);let me=_e[$];me===void 0&&(me={type:void 0,texture:void 0},_e[$]=me),(me.type!==P||me.texture!==se)&&(re!==$&&(n.activeTexture($),re=$),n.bindTexture(P,se||le[P]),me.type=P,me.texture=se)}function ue(){const P=_e[re];P!==void 0&&P.type!==void 0&&(n.bindTexture(P.type,null),P.type=void 0,P.texture=void 0)}function vt(){try{n.compressedTexImage2D(...arguments)}catch(P){Pe("WebGLState:",P)}}function E(){try{n.compressedTexImage3D(...arguments)}catch(P){Pe("WebGLState:",P)}}function _(){try{n.texSubImage2D(...arguments)}catch(P){Pe("WebGLState:",P)}}function B(){try{n.texSubImage3D(...arguments)}catch(P){Pe("WebGLState:",P)}}function j(){try{n.compressedTexSubImage2D(...arguments)}catch(P){Pe("WebGLState:",P)}}function ee(){try{n.compressedTexSubImage3D(...arguments)}catch(P){Pe("WebGLState:",P)}}function ne(){try{n.texStorage2D(...arguments)}catch(P){Pe("WebGLState:",P)}}function ce(){try{n.texStorage3D(...arguments)}catch(P){Pe("WebGLState:",P)}}function Z(){try{n.texImage2D(...arguments)}catch(P){Pe("WebGLState:",P)}}function K(){try{n.texImage3D(...arguments)}catch(P){Pe("WebGLState:",P)}}function pe(P){return d[P]!==void 0?d[P]:n.getParameter(P)}function xe(P,se){d[P]!==se&&(n.pixelStorei(P,se),d[P]=se)}function oe(P){Le.equals(P)===!1&&(n.scissor(P.x,P.y,P.z,P.w),Le.copy(P))}function ie(P){Re.equals(P)===!1&&(n.viewport(P.x,P.y,P.z,P.w),Re.copy(P))}function De(P,se){let $=l.get(se);$===void 0&&($=new WeakMap,l.set(se,$));let me=$.get(P);me===void 0&&(me=n.getUniformBlockIndex(se,P.name),$.set(P,me))}function ke(P,se){const me=l.get(se).get(P);c.get(se)!==me&&(n.uniformBlockBinding(se,me,P.__bindingPointIndex),c.set(se,me))}function Je(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),o.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),n.pixelStorei(n.PACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,!1),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,n.BROWSER_DEFAULT_WEBGL),n.pixelStorei(n.PACK_ROW_LENGTH,0),n.pixelStorei(n.PACK_SKIP_PIXELS,0),n.pixelStorei(n.PACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_ROW_LENGTH,0),n.pixelStorei(n.UNPACK_IMAGE_HEIGHT,0),n.pixelStorei(n.UNPACK_SKIP_PIXELS,0),n.pixelStorei(n.UNPACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_SKIP_IMAGES,0),u={},d={},re=null,_e={},h={},f=new WeakMap,g=[],x=null,m=!1,p=null,S=null,b=null,y=null,w=null,T=null,C=null,v=new Ne(0,0,0),A=0,L=!1,R=null,O=null,H=null,X=null,N=null,Le.set(0,0,n.canvas.width,n.canvas.height),Re.set(0,0,n.canvas.width,n.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:te,disable:Ce,bindFramebuffer:Ue,drawBuffers:Ie,useProgram:mt,setBlending:dt,setMaterial:Xe,setFlipSided:Ct,setCullFace:gt,setLineWidth:Kt,setPolygonOffset:U,setScissorTest:Pt,activeTexture:je,bindTexture:ut,unbindTexture:ue,compressedTexImage2D:vt,compressedTexImage3D:E,texImage2D:Z,texImage3D:K,pixelStorei:xe,getParameter:pe,updateUBOMapping:De,uniformBlockBinding:ke,texStorage2D:ne,texStorage3D:ce,texSubImage2D:_,texSubImage3D:B,compressedTexSubImage2D:j,compressedTexSubImage3D:ee,scissor:oe,viewport:ie,reset:Je}}function oE(n,e,t,i,s,r,o){const a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new Ye,u=new WeakMap,d=new Set;let h;const f=new WeakMap;let g=!1;try{g=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function x(E,_){return g?new OffscreenCanvas(E,_):js("canvas")}function m(E,_,B){let j=1;const ee=vt(E);if((ee.width>B||ee.height>B)&&(j=B/Math.max(ee.width,ee.height)),j<1)if(typeof HTMLImageElement<"u"&&E instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&E instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&E instanceof ImageBitmap||typeof VideoFrame<"u"&&E instanceof VideoFrame){const ne=Math.floor(j*ee.width),ce=Math.floor(j*ee.height);h===void 0&&(h=x(ne,ce));const Z=_?x(ne,ce):h;return Z.width=ne,Z.height=ce,Z.getContext("2d").drawImage(E,0,0,ne,ce),be("WebGLRenderer: Texture has been resized from ("+ee.width+"x"+ee.height+") to ("+ne+"x"+ce+")."),Z}else return"data"in E&&be("WebGLRenderer: Image in DataTexture is too big ("+ee.width+"x"+ee.height+")."),E;return E}function p(E){return E.generateMipmaps}function S(E){n.generateMipmap(E)}function b(E){return E.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:E.isWebGL3DRenderTarget?n.TEXTURE_3D:E.isWebGLArrayRenderTarget||E.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function y(E,_,B,j,ee,ne=!1){if(E!==null){if(n[E]!==void 0)return n[E];be("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+E+"'")}let ce;j&&(ce=e.get("EXT_texture_norm16"),ce||be("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let Z=_;if(_===n.RED&&(B===n.FLOAT&&(Z=n.R32F),B===n.HALF_FLOAT&&(Z=n.R16F),B===n.UNSIGNED_BYTE&&(Z=n.R8),B===n.UNSIGNED_SHORT&&ce&&(Z=ce.R16_EXT),B===n.SHORT&&ce&&(Z=ce.R16_SNORM_EXT)),_===n.RED_INTEGER&&(B===n.UNSIGNED_BYTE&&(Z=n.R8UI),B===n.UNSIGNED_SHORT&&(Z=n.R16UI),B===n.UNSIGNED_INT&&(Z=n.R32UI),B===n.BYTE&&(Z=n.R8I),B===n.SHORT&&(Z=n.R16I),B===n.INT&&(Z=n.R32I)),_===n.RG&&(B===n.FLOAT&&(Z=n.RG32F),B===n.HALF_FLOAT&&(Z=n.RG16F),B===n.UNSIGNED_BYTE&&(Z=n.RG8),B===n.UNSIGNED_SHORT&&ce&&(Z=ce.RG16_EXT),B===n.SHORT&&ce&&(Z=ce.RG16_SNORM_EXT)),_===n.RG_INTEGER&&(B===n.UNSIGNED_BYTE&&(Z=n.RG8UI),B===n.UNSIGNED_SHORT&&(Z=n.RG16UI),B===n.UNSIGNED_INT&&(Z=n.RG32UI),B===n.BYTE&&(Z=n.RG8I),B===n.SHORT&&(Z=n.RG16I),B===n.INT&&(Z=n.RG32I)),_===n.RGB_INTEGER&&(B===n.UNSIGNED_BYTE&&(Z=n.RGB8UI),B===n.UNSIGNED_SHORT&&(Z=n.RGB16UI),B===n.UNSIGNED_INT&&(Z=n.RGB32UI),B===n.BYTE&&(Z=n.RGB8I),B===n.SHORT&&(Z=n.RGB16I),B===n.INT&&(Z=n.RGB32I)),_===n.RGBA_INTEGER&&(B===n.UNSIGNED_BYTE&&(Z=n.RGBA8UI),B===n.UNSIGNED_SHORT&&(Z=n.RGBA16UI),B===n.UNSIGNED_INT&&(Z=n.RGBA32UI),B===n.BYTE&&(Z=n.RGBA8I),B===n.SHORT&&(Z=n.RGBA16I),B===n.INT&&(Z=n.RGBA32I)),_===n.RGB&&(B===n.UNSIGNED_SHORT&&ce&&(Z=ce.RGB16_EXT),B===n.SHORT&&ce&&(Z=ce.RGB16_SNORM_EXT),B===n.UNSIGNED_INT_5_9_9_9_REV&&(Z=n.RGB9_E5),B===n.UNSIGNED_INT_10F_11F_11F_REV&&(Z=n.R11F_G11F_B10F)),_===n.RGBA){const K=ne?$r:Ze.getTransfer(ee);B===n.FLOAT&&(Z=n.RGBA32F),B===n.HALF_FLOAT&&(Z=n.RGBA16F),B===n.UNSIGNED_BYTE&&(Z=K===Qe?n.SRGB8_ALPHA8:n.RGBA8),B===n.UNSIGNED_SHORT&&ce&&(Z=ce.RGBA16_EXT),B===n.SHORT&&ce&&(Z=ce.RGBA16_SNORM_EXT),B===n.UNSIGNED_SHORT_4_4_4_4&&(Z=n.RGBA4),B===n.UNSIGNED_SHORT_5_5_5_1&&(Z=n.RGB5_A1)}return(Z===n.R16F||Z===n.R32F||Z===n.RG16F||Z===n.RG32F||Z===n.RGBA16F||Z===n.RGBA32F)&&e.get("EXT_color_buffer_float"),Z}function w(E,_){let B;return E?_===null||_===Pn||_===Xs?B=n.DEPTH24_STENCIL8:_===ln?B=n.DEPTH32F_STENCIL8:_===Ws&&(B=n.DEPTH24_STENCIL8,be("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):_===null||_===Pn||_===Xs?B=n.DEPTH_COMPONENT24:_===ln?B=n.DEPTH_COMPONENT32F:_===Ws&&(B=n.DEPTH_COMPONENT16),B}function T(E,_){return p(E)===!0||E.isFramebufferTexture&&E.minFilter!==It&&E.minFilter!==Lt?Math.log2(Math.max(_.width,_.height))+1:E.mipmaps!==void 0&&E.mipmaps.length>0?E.mipmaps.length:E.isCompressedTexture&&Array.isArray(E.image)?_.mipmaps.length:1}function C(E){const _=E.target;_.removeEventListener("dispose",C),A(_),_.isVideoTexture&&u.delete(_),_.isHTMLTexture&&d.delete(_)}function v(E){const _=E.target;_.removeEventListener("dispose",v),R(_)}function A(E){const _=i.get(E);if(_.__webglInit===void 0)return;const B=E.source,j=f.get(B);if(j){const ee=j[_.__cacheKey];ee.usedTimes--,ee.usedTimes===0&&L(E),Object.keys(j).length===0&&f.delete(B)}i.remove(E)}function L(E){const _=i.get(E);n.deleteTexture(_.__webglTexture);const B=E.source,j=f.get(B);delete j[_.__cacheKey],o.memory.textures--}function R(E){const _=i.get(E);if(E.depthTexture&&(E.depthTexture.dispose(),i.remove(E.depthTexture)),E.isWebGLCubeRenderTarget)for(let j=0;j<6;j++){if(Array.isArray(_.__webglFramebuffer[j]))for(let ee=0;ee<_.__webglFramebuffer[j].length;ee++)n.deleteFramebuffer(_.__webglFramebuffer[j][ee]);else n.deleteFramebuffer(_.__webglFramebuffer[j]);_.__webglDepthbuffer&&n.deleteRenderbuffer(_.__webglDepthbuffer[j])}else{if(Array.isArray(_.__webglFramebuffer))for(let j=0;j<_.__webglFramebuffer.length;j++)n.deleteFramebuffer(_.__webglFramebuffer[j]);else n.deleteFramebuffer(_.__webglFramebuffer);if(_.__webglDepthbuffer&&n.deleteRenderbuffer(_.__webglDepthbuffer),_.__webglMultisampledFramebuffer&&n.deleteFramebuffer(_.__webglMultisampledFramebuffer),_.__webglColorRenderbuffer)for(let j=0;j<_.__webglColorRenderbuffer.length;j++)_.__webglColorRenderbuffer[j]&&n.deleteRenderbuffer(_.__webglColorRenderbuffer[j]);_.__webglDepthRenderbuffer&&n.deleteRenderbuffer(_.__webglDepthRenderbuffer)}const B=E.textures;for(let j=0,ee=B.length;j<ee;j++){const ne=i.get(B[j]);ne.__webglTexture&&(n.deleteTexture(ne.__webglTexture),o.memory.textures--),i.remove(B[j])}i.remove(E)}let O=0;function H(){O=0}function X(){return O}function N(E){O=E}function I(){const E=O;return E>=s.maxTextures&&be("WebGLTextures: Trying to use "+E+" texture units while this GPU supports only "+s.maxTextures),O+=1,E}function D(E){const _=[];return _.push(E.wrapS),_.push(E.wrapT),_.push(E.wrapR||0),_.push(E.magFilter),_.push(E.minFilter),_.push(E.anisotropy),_.push(E.internalFormat),_.push(E.format),_.push(E.type),_.push(E.generateMipmaps),_.push(E.premultiplyAlpha),_.push(E.flipY),_.push(E.unpackAlignment),_.push(E.colorSpace),_.join()}function W(E,_){const B=i.get(E);if(E.isVideoTexture&&ut(E),E.isRenderTargetTexture===!1&&E.isExternalTexture!==!0&&E.version>0&&B.__version!==E.version){const j=E.image;if(j===null)be("WebGLRenderer: Texture marked for update but no image data found.");else if(j.complete===!1)be("WebGLRenderer: Texture marked for update but image is incomplete");else{Ce(B,E,_);return}}else E.isExternalTexture&&(B.__webglTexture=E.sourceTexture?E.sourceTexture:null);t.bindTexture(n.TEXTURE_2D,B.__webglTexture,n.TEXTURE0+_)}function J(E,_){const B=i.get(E);if(E.isRenderTargetTexture===!1&&E.version>0&&B.__version!==E.version){Ce(B,E,_);return}else E.isExternalTexture&&(B.__webglTexture=E.sourceTexture?E.sourceTexture:null);t.bindTexture(n.TEXTURE_2D_ARRAY,B.__webglTexture,n.TEXTURE0+_)}function re(E,_){const B=i.get(E);if(E.isRenderTargetTexture===!1&&E.version>0&&B.__version!==E.version){Ce(B,E,_);return}t.bindTexture(n.TEXTURE_3D,B.__webglTexture,n.TEXTURE0+_)}function _e(E,_){const B=i.get(E);if(E.isCubeDepthTexture!==!0&&E.version>0&&B.__version!==E.version){Ue(B,E,_);return}t.bindTexture(n.TEXTURE_CUBE_MAP,B.__webglTexture,n.TEXTURE0+_)}const Se={[li]:n.REPEAT,[Tn]:n.CLAMP_TO_EDGE,[Wr]:n.MIRRORED_REPEAT},ve={[It]:n.NEAREST,[id]:n.NEAREST_MIPMAP_NEAREST,[Fs]:n.NEAREST_MIPMAP_LINEAR,[Lt]:n.LINEAR,[Nr]:n.LINEAR_MIPMAP_NEAREST,[Gn]:n.LINEAR_MIPMAP_LINEAR},Le={[L0]:n.NEVER,[F0]:n.ALWAYS,[N0]:n.LESS,[Ic]:n.LEQUAL,[D0]:n.EQUAL,[Lc]:n.GEQUAL,[U0]:n.GREATER,[O0]:n.NOTEQUAL};function Re(E,_){if(_.type===ln&&e.has("OES_texture_float_linear")===!1&&(_.magFilter===Lt||_.magFilter===Nr||_.magFilter===Fs||_.magFilter===Gn||_.minFilter===Lt||_.minFilter===Nr||_.minFilter===Fs||_.minFilter===Gn)&&be("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(E,n.TEXTURE_WRAP_S,Se[_.wrapS]),n.texParameteri(E,n.TEXTURE_WRAP_T,Se[_.wrapT]),(E===n.TEXTURE_3D||E===n.TEXTURE_2D_ARRAY)&&n.texParameteri(E,n.TEXTURE_WRAP_R,Se[_.wrapR]),n.texParameteri(E,n.TEXTURE_MAG_FILTER,ve[_.magFilter]),n.texParameteri(E,n.TEXTURE_MIN_FILTER,ve[_.minFilter]),_.compareFunction&&(n.texParameteri(E,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(E,n.TEXTURE_COMPARE_FUNC,Le[_.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(_.magFilter===It||_.minFilter!==Fs&&_.minFilter!==Gn||_.type===ln&&e.has("OES_texture_float_linear")===!1)return;if(_.anisotropy>1||i.get(_).__currentAnisotropy){const B=e.get("EXT_texture_filter_anisotropic");n.texParameterf(E,B.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(_.anisotropy,s.getMaxAnisotropy())),i.get(_).__currentAnisotropy=_.anisotropy}}}function q(E,_){let B=!1;E.__webglInit===void 0&&(E.__webglInit=!0,_.addEventListener("dispose",C));const j=_.source;let ee=f.get(j);ee===void 0&&(ee={},f.set(j,ee));const ne=D(_);if(ne!==E.__cacheKey){ee[ne]===void 0&&(ee[ne]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,B=!0),ee[ne].usedTimes++;const ce=ee[E.__cacheKey];ce!==void 0&&(ee[E.__cacheKey].usedTimes--,ce.usedTimes===0&&L(_)),E.__cacheKey=ne,E.__webglTexture=ee[ne].texture}return B}function le(E,_,B){return Math.floor(Math.floor(E/B)/_)}function te(E,_,B,j){const ne=E.updateRanges;if(ne.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,_.width,_.height,B,j,_.data);else{ne.sort((xe,oe)=>xe.start-oe.start);let ce=0;for(let xe=1;xe<ne.length;xe++){const oe=ne[ce],ie=ne[xe],De=oe.start+oe.count,ke=le(ie.start,_.width,4),Je=le(oe.start,_.width,4);ie.start<=De+1&&ke===Je&&le(ie.start+ie.count-1,_.width,4)===ke?oe.count=Math.max(oe.count,ie.start+ie.count-oe.start):(++ce,ne[ce]=ie)}ne.length=ce+1;const Z=t.getParameter(n.UNPACK_ROW_LENGTH),K=t.getParameter(n.UNPACK_SKIP_PIXELS),pe=t.getParameter(n.UNPACK_SKIP_ROWS);t.pixelStorei(n.UNPACK_ROW_LENGTH,_.width);for(let xe=0,oe=ne.length;xe<oe;xe++){const ie=ne[xe],De=Math.floor(ie.start/4),ke=Math.ceil(ie.count/4),Je=De%_.width,P=Math.floor(De/_.width),se=ke,$=1;t.pixelStorei(n.UNPACK_SKIP_PIXELS,Je),t.pixelStorei(n.UNPACK_SKIP_ROWS,P),t.texSubImage2D(n.TEXTURE_2D,0,Je,P,se,$,B,j,_.data)}E.clearUpdateRanges(),t.pixelStorei(n.UNPACK_ROW_LENGTH,Z),t.pixelStorei(n.UNPACK_SKIP_PIXELS,K),t.pixelStorei(n.UNPACK_SKIP_ROWS,pe)}}function Ce(E,_,B){let j=n.TEXTURE_2D;(_.isDataArrayTexture||_.isCompressedArrayTexture)&&(j=n.TEXTURE_2D_ARRAY),_.isData3DTexture&&(j=n.TEXTURE_3D);const ee=q(E,_),ne=_.source;t.bindTexture(j,E.__webglTexture,n.TEXTURE0+B);const ce=i.get(ne);if(ne.version!==ce.__version||ee===!0){if(t.activeTexture(n.TEXTURE0+B),(typeof ImageBitmap<"u"&&_.image instanceof ImageBitmap)===!1){const $=Ze.getPrimaries(Ze.workingColorSpace),me=_.colorSpace===oi?null:Ze.getPrimaries(_.colorSpace),ae=_.colorSpace===oi||$===me?n.NONE:n.BROWSER_DEFAULT_WEBGL;t.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,_.flipY),t.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),t.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,ae)}t.pixelStorei(n.UNPACK_ALIGNMENT,_.unpackAlignment);let K=m(_.image,!1,s.maxTextureSize);K=ue(_,K);const pe=r.convert(_.format,_.colorSpace),xe=r.convert(_.type);let oe=y(_.internalFormat,pe,xe,_.normalized,_.colorSpace,_.isVideoTexture);Re(j,_);let ie;const De=_.mipmaps,ke=_.isVideoTexture!==!0,Je=ce.__version===void 0||ee===!0,P=ne.dataReady,se=T(_,K);if(_.isDepthTexture)oe=w(_.format===bi,_.type),Je&&(ke?t.texStorage2D(n.TEXTURE_2D,1,oe,K.width,K.height):t.texImage2D(n.TEXTURE_2D,0,oe,K.width,K.height,0,pe,xe,null));else if(_.isDataTexture)if(De.length>0){ke&&Je&&t.texStorage2D(n.TEXTURE_2D,se,oe,De[0].width,De[0].height);for(let $=0,me=De.length;$<me;$++)ie=De[$],ke?P&&t.texSubImage2D(n.TEXTURE_2D,$,0,0,ie.width,ie.height,pe,xe,ie.data):t.texImage2D(n.TEXTURE_2D,$,oe,ie.width,ie.height,0,pe,xe,ie.data);_.generateMipmaps=!1}else ke?(Je&&t.texStorage2D(n.TEXTURE_2D,se,oe,K.width,K.height),P&&te(_,K,pe,xe)):t.texImage2D(n.TEXTURE_2D,0,oe,K.width,K.height,0,pe,xe,K.data);else if(_.isCompressedTexture)if(_.isCompressedArrayTexture){ke&&Je&&t.texStorage3D(n.TEXTURE_2D_ARRAY,se,oe,De[0].width,De[0].height,K.depth);for(let $=0,me=De.length;$<me;$++)if(ie=De[$],_.format!==un)if(pe!==null)if(ke){if(P)if(_.layerUpdates.size>0){const ae=vu(ie.width,ie.height,_.format,_.type);for(const Q of _.layerUpdates){const Ee=ie.data.subarray(Q*ae/ie.data.BYTES_PER_ELEMENT,(Q+1)*ae/ie.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,$,0,0,Q,ie.width,ie.height,1,pe,Ee)}_.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,$,0,0,0,ie.width,ie.height,K.depth,pe,ie.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,$,oe,ie.width,ie.height,K.depth,0,ie.data,0,0);else be("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else ke?P&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,$,0,0,0,ie.width,ie.height,K.depth,pe,xe,ie.data):t.texImage3D(n.TEXTURE_2D_ARRAY,$,oe,ie.width,ie.height,K.depth,0,pe,xe,ie.data)}else{ke&&Je&&t.texStorage2D(n.TEXTURE_2D,se,oe,De[0].width,De[0].height);for(let $=0,me=De.length;$<me;$++)ie=De[$],_.format!==un?pe!==null?ke?P&&t.compressedTexSubImage2D(n.TEXTURE_2D,$,0,0,ie.width,ie.height,pe,ie.data):t.compressedTexImage2D(n.TEXTURE_2D,$,oe,ie.width,ie.height,0,ie.data):be("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ke?P&&t.texSubImage2D(n.TEXTURE_2D,$,0,0,ie.width,ie.height,pe,xe,ie.data):t.texImage2D(n.TEXTURE_2D,$,oe,ie.width,ie.height,0,pe,xe,ie.data)}else if(_.isDataArrayTexture)if(ke){if(Je&&t.texStorage3D(n.TEXTURE_2D_ARRAY,se,oe,K.width,K.height,K.depth),P)if(_.layerUpdates.size>0){const $=vu(K.width,K.height,_.format,_.type);for(const me of _.layerUpdates){const ae=K.data.subarray(me*$/K.data.BYTES_PER_ELEMENT,(me+1)*$/K.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,me,K.width,K.height,1,pe,xe,ae)}_.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,K.width,K.height,K.depth,pe,xe,K.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,oe,K.width,K.height,K.depth,0,pe,xe,K.data);else if(_.isData3DTexture)ke?(Je&&t.texStorage3D(n.TEXTURE_3D,se,oe,K.width,K.height,K.depth),P&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,K.width,K.height,K.depth,pe,xe,K.data)):t.texImage3D(n.TEXTURE_3D,0,oe,K.width,K.height,K.depth,0,pe,xe,K.data);else if(_.isFramebufferTexture){if(Je)if(ke)t.texStorage2D(n.TEXTURE_2D,se,oe,K.width,K.height);else{let $=K.width,me=K.height;for(let ae=0;ae<se;ae++)t.texImage2D(n.TEXTURE_2D,ae,oe,$,me,0,pe,xe,null),$>>=1,me>>=1}}else if(_.isHTMLTexture){if("texElementImage2D"in n){const $=n.canvas;if($.hasAttribute("layoutsubtree")||$.setAttribute("layoutsubtree","true"),K.parentNode!==$){$.appendChild(K),d.add(_),$.onpaint=Fe=>{const Mt=Fe.changedElements;for(const st of d)Mt.includes(st.image)&&(st.needsUpdate=!0)},$.requestPaint();return}const me=0,ae=n.RGBA,Q=n.RGBA,Ee=n.UNSIGNED_BYTE;n.texElementImage2D(n.TEXTURE_2D,me,ae,Q,Ee,K),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE)}}else if(De.length>0){if(ke&&Je){const $=vt(De[0]);t.texStorage2D(n.TEXTURE_2D,se,oe,$.width,$.height)}for(let $=0,me=De.length;$<me;$++)ie=De[$],ke?P&&t.texSubImage2D(n.TEXTURE_2D,$,0,0,pe,xe,ie):t.texImage2D(n.TEXTURE_2D,$,oe,pe,xe,ie);_.generateMipmaps=!1}else if(ke){if(Je){const $=vt(K);t.texStorage2D(n.TEXTURE_2D,se,oe,$.width,$.height)}P&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,pe,xe,K)}else t.texImage2D(n.TEXTURE_2D,0,oe,pe,xe,K);p(_)&&S(j),ce.__version=ne.version,_.onUpdate&&_.onUpdate(_)}E.__version=_.version}function Ue(E,_,B){if(_.image.length!==6)return;const j=q(E,_),ee=_.source;t.bindTexture(n.TEXTURE_CUBE_MAP,E.__webglTexture,n.TEXTURE0+B);const ne=i.get(ee);if(ee.version!==ne.__version||j===!0){t.activeTexture(n.TEXTURE0+B);const ce=Ze.getPrimaries(Ze.workingColorSpace),Z=_.colorSpace===oi?null:Ze.getPrimaries(_.colorSpace),K=_.colorSpace===oi||ce===Z?n.NONE:n.BROWSER_DEFAULT_WEBGL;t.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,_.flipY),t.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),t.pixelStorei(n.UNPACK_ALIGNMENT,_.unpackAlignment),t.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,K);const pe=_.isCompressedTexture||_.image[0].isCompressedTexture,xe=_.image[0]&&_.image[0].isDataTexture,oe=[];for(let Q=0;Q<6;Q++)!pe&&!xe?oe[Q]=m(_.image[Q],!0,s.maxCubemapSize):oe[Q]=xe?_.image[Q].image:_.image[Q],oe[Q]=ue(_,oe[Q]);const ie=oe[0],De=r.convert(_.format,_.colorSpace),ke=r.convert(_.type),Je=y(_.internalFormat,De,ke,_.normalized,_.colorSpace),P=_.isVideoTexture!==!0,se=ne.__version===void 0||j===!0,$=ee.dataReady;let me=T(_,ie);Re(n.TEXTURE_CUBE_MAP,_);let ae;if(pe){P&&se&&t.texStorage2D(n.TEXTURE_CUBE_MAP,me,Je,ie.width,ie.height);for(let Q=0;Q<6;Q++){ae=oe[Q].mipmaps;for(let Ee=0;Ee<ae.length;Ee++){const Fe=ae[Ee];_.format!==un?De!==null?P?$&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Ee,0,0,Fe.width,Fe.height,De,Fe.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Ee,Je,Fe.width,Fe.height,0,Fe.data):be("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):P?$&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Ee,0,0,Fe.width,Fe.height,De,ke,Fe.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Ee,Je,Fe.width,Fe.height,0,De,ke,Fe.data)}}}else{if(ae=_.mipmaps,P&&se){ae.length>0&&me++;const Q=vt(oe[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,me,Je,Q.width,Q.height)}for(let Q=0;Q<6;Q++)if(xe){P?$&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,0,0,oe[Q].width,oe[Q].height,De,ke,oe[Q].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,Je,oe[Q].width,oe[Q].height,0,De,ke,oe[Q].data);for(let Ee=0;Ee<ae.length;Ee++){const Mt=ae[Ee].image[Q].image;P?$&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Ee+1,0,0,Mt.width,Mt.height,De,ke,Mt.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Ee+1,Je,Mt.width,Mt.height,0,De,ke,Mt.data)}}else{P?$&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,0,0,De,ke,oe[Q]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,Je,De,ke,oe[Q]);for(let Ee=0;Ee<ae.length;Ee++){const Fe=ae[Ee];P?$&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Ee+1,0,0,De,ke,Fe.image[Q]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Ee+1,Je,De,ke,Fe.image[Q])}}}p(_)&&S(n.TEXTURE_CUBE_MAP),ne.__version=ee.version,_.onUpdate&&_.onUpdate(_)}E.__version=_.version}function Ie(E,_,B,j,ee,ne){const ce=r.convert(B.format,B.colorSpace),Z=r.convert(B.type),K=y(B.internalFormat,ce,Z,B.normalized,B.colorSpace),pe=i.get(_),xe=i.get(B);if(xe.__renderTarget=_,!pe.__hasExternalTextures){const oe=Math.max(1,_.width>>ne),ie=Math.max(1,_.height>>ne);ee===n.TEXTURE_3D||ee===n.TEXTURE_2D_ARRAY?t.texImage3D(ee,ne,K,oe,ie,_.depth,0,ce,Z,null):t.texImage2D(ee,ne,K,oe,ie,0,ce,Z,null)}t.bindFramebuffer(n.FRAMEBUFFER,E),je(_)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,j,ee,xe.__webglTexture,0,Pt(_)):(ee===n.TEXTURE_2D||ee>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&ee<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,j,ee,xe.__webglTexture,ne),t.bindFramebuffer(n.FRAMEBUFFER,null)}function mt(E,_,B){if(n.bindRenderbuffer(n.RENDERBUFFER,E),_.depthBuffer){const j=_.depthTexture,ee=j&&j.isDepthTexture?j.type:null,ne=w(_.stencilBuffer,ee),ce=_.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;je(_)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Pt(_),ne,_.width,_.height):B?n.renderbufferStorageMultisample(n.RENDERBUFFER,Pt(_),ne,_.width,_.height):n.renderbufferStorage(n.RENDERBUFFER,ne,_.width,_.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,ce,n.RENDERBUFFER,E)}else{const j=_.textures;for(let ee=0;ee<j.length;ee++){const ne=j[ee],ce=r.convert(ne.format,ne.colorSpace),Z=r.convert(ne.type),K=y(ne.internalFormat,ce,Z,ne.normalized,ne.colorSpace);je(_)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Pt(_),K,_.width,_.height):B?n.renderbufferStorageMultisample(n.RENDERBUFFER,Pt(_),K,_.width,_.height):n.renderbufferStorage(n.RENDERBUFFER,K,_.width,_.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function qe(E,_,B){const j=_.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(n.FRAMEBUFFER,E),!(_.depthTexture&&_.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const ee=i.get(_.depthTexture);if(ee.__renderTarget=_,(!ee.__webglTexture||_.depthTexture.image.width!==_.width||_.depthTexture.image.height!==_.height)&&(_.depthTexture.image.width=_.width,_.depthTexture.image.height=_.height,_.depthTexture.needsUpdate=!0),j){if(ee.__webglInit===void 0&&(ee.__webglInit=!0,_.depthTexture.addEventListener("dispose",C)),ee.__webglTexture===void 0){ee.__webglTexture=n.createTexture(),t.bindTexture(n.TEXTURE_CUBE_MAP,ee.__webglTexture),Re(n.TEXTURE_CUBE_MAP,_.depthTexture);const pe=r.convert(_.depthTexture.format),xe=r.convert(_.depthTexture.type);let oe;_.depthTexture.format===$n?oe=n.DEPTH_COMPONENT24:_.depthTexture.format===bi&&(oe=n.DEPTH24_STENCIL8);for(let ie=0;ie<6;ie++)n.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,oe,_.width,_.height,0,pe,xe,null)}}else W(_.depthTexture,0);const ne=ee.__webglTexture,ce=Pt(_),Z=j?n.TEXTURE_CUBE_MAP_POSITIVE_X+B:n.TEXTURE_2D,K=_.depthTexture.format===bi?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;if(_.depthTexture.format===$n)je(_)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,K,Z,ne,0,ce):n.framebufferTexture2D(n.FRAMEBUFFER,K,Z,ne,0);else if(_.depthTexture.format===bi)je(_)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,K,Z,ne,0,ce):n.framebufferTexture2D(n.FRAMEBUFFER,K,Z,ne,0);else throw new Error("Unknown depthTexture format")}function it(E){const _=i.get(E),B=E.isWebGLCubeRenderTarget===!0;if(_.__boundDepthTexture!==E.depthTexture){const j=E.depthTexture;if(_.__depthDisposeCallback&&_.__depthDisposeCallback(),j){const ee=()=>{delete _.__boundDepthTexture,delete _.__depthDisposeCallback,j.removeEventListener("dispose",ee)};j.addEventListener("dispose",ee),_.__depthDisposeCallback=ee}_.__boundDepthTexture=j}if(E.depthTexture&&!_.__autoAllocateDepthBuffer)if(B)for(let j=0;j<6;j++)qe(_.__webglFramebuffer[j],E,j);else{const j=E.texture.mipmaps;j&&j.length>0?qe(_.__webglFramebuffer[0],E,0):qe(_.__webglFramebuffer,E,0)}else if(B){_.__webglDepthbuffer=[];for(let j=0;j<6;j++)if(t.bindFramebuffer(n.FRAMEBUFFER,_.__webglFramebuffer[j]),_.__webglDepthbuffer[j]===void 0)_.__webglDepthbuffer[j]=n.createRenderbuffer(),mt(_.__webglDepthbuffer[j],E,!1);else{const ee=E.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ne=_.__webglDepthbuffer[j];n.bindRenderbuffer(n.RENDERBUFFER,ne),n.framebufferRenderbuffer(n.FRAMEBUFFER,ee,n.RENDERBUFFER,ne)}}else{const j=E.texture.mipmaps;if(j&&j.length>0?t.bindFramebuffer(n.FRAMEBUFFER,_.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,_.__webglFramebuffer),_.__webglDepthbuffer===void 0)_.__webglDepthbuffer=n.createRenderbuffer(),mt(_.__webglDepthbuffer,E,!1);else{const ee=E.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ne=_.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,ne),n.framebufferRenderbuffer(n.FRAMEBUFFER,ee,n.RENDERBUFFER,ne)}}t.bindFramebuffer(n.FRAMEBUFFER,null)}function dt(E,_,B){const j=i.get(E);_!==void 0&&Ie(j.__webglFramebuffer,E,E.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),B!==void 0&&it(E)}function Xe(E){const _=E.texture,B=i.get(E),j=i.get(_);E.addEventListener("dispose",v);const ee=E.textures,ne=E.isWebGLCubeRenderTarget===!0,ce=ee.length>1;if(ce||(j.__webglTexture===void 0&&(j.__webglTexture=n.createTexture()),j.__version=_.version,o.memory.textures++),ne){B.__webglFramebuffer=[];for(let Z=0;Z<6;Z++)if(_.mipmaps&&_.mipmaps.length>0){B.__webglFramebuffer[Z]=[];for(let K=0;K<_.mipmaps.length;K++)B.__webglFramebuffer[Z][K]=n.createFramebuffer()}else B.__webglFramebuffer[Z]=n.createFramebuffer()}else{if(_.mipmaps&&_.mipmaps.length>0){B.__webglFramebuffer=[];for(let Z=0;Z<_.mipmaps.length;Z++)B.__webglFramebuffer[Z]=n.createFramebuffer()}else B.__webglFramebuffer=n.createFramebuffer();if(ce)for(let Z=0,K=ee.length;Z<K;Z++){const pe=i.get(ee[Z]);pe.__webglTexture===void 0&&(pe.__webglTexture=n.createTexture(),o.memory.textures++)}if(E.samples>0&&je(E)===!1){B.__webglMultisampledFramebuffer=n.createFramebuffer(),B.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,B.__webglMultisampledFramebuffer);for(let Z=0;Z<ee.length;Z++){const K=ee[Z];B.__webglColorRenderbuffer[Z]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,B.__webglColorRenderbuffer[Z]);const pe=r.convert(K.format,K.colorSpace),xe=r.convert(K.type),oe=y(K.internalFormat,pe,xe,K.normalized,K.colorSpace,E.isXRRenderTarget===!0),ie=Pt(E);n.renderbufferStorageMultisample(n.RENDERBUFFER,ie,oe,E.width,E.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Z,n.RENDERBUFFER,B.__webglColorRenderbuffer[Z])}n.bindRenderbuffer(n.RENDERBUFFER,null),E.depthBuffer&&(B.__webglDepthRenderbuffer=n.createRenderbuffer(),mt(B.__webglDepthRenderbuffer,E,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(ne){t.bindTexture(n.TEXTURE_CUBE_MAP,j.__webglTexture),Re(n.TEXTURE_CUBE_MAP,_);for(let Z=0;Z<6;Z++)if(_.mipmaps&&_.mipmaps.length>0)for(let K=0;K<_.mipmaps.length;K++)Ie(B.__webglFramebuffer[Z][K],E,_,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,K);else Ie(B.__webglFramebuffer[Z],E,_,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0);p(_)&&S(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(ce){for(let Z=0,K=ee.length;Z<K;Z++){const pe=ee[Z],xe=i.get(pe);let oe=n.TEXTURE_2D;(E.isWebGL3DRenderTarget||E.isWebGLArrayRenderTarget)&&(oe=E.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(oe,xe.__webglTexture),Re(oe,pe),Ie(B.__webglFramebuffer,E,pe,n.COLOR_ATTACHMENT0+Z,oe,0),p(pe)&&S(oe)}t.unbindTexture()}else{let Z=n.TEXTURE_2D;if((E.isWebGL3DRenderTarget||E.isWebGLArrayRenderTarget)&&(Z=E.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(Z,j.__webglTexture),Re(Z,_),_.mipmaps&&_.mipmaps.length>0)for(let K=0;K<_.mipmaps.length;K++)Ie(B.__webglFramebuffer[K],E,_,n.COLOR_ATTACHMENT0,Z,K);else Ie(B.__webglFramebuffer,E,_,n.COLOR_ATTACHMENT0,Z,0);p(_)&&S(Z),t.unbindTexture()}E.depthBuffer&&it(E)}function Ct(E){const _=E.textures;for(let B=0,j=_.length;B<j;B++){const ee=_[B];if(p(ee)){const ne=b(E),ce=i.get(ee).__webglTexture;t.bindTexture(ne,ce),S(ne),t.unbindTexture()}}}const gt=[],Kt=[];function U(E){if(E.samples>0){if(je(E)===!1){const _=E.textures,B=E.width,j=E.height;let ee=n.COLOR_BUFFER_BIT;const ne=E.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ce=i.get(E),Z=_.length>1;if(Z)for(let pe=0;pe<_.length;pe++)t.bindFramebuffer(n.FRAMEBUFFER,ce.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+pe,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,ce.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+pe,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,ce.__webglMultisampledFramebuffer);const K=E.texture.mipmaps;K&&K.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,ce.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,ce.__webglFramebuffer);for(let pe=0;pe<_.length;pe++){if(E.resolveDepthBuffer&&(E.depthBuffer&&(ee|=n.DEPTH_BUFFER_BIT),E.stencilBuffer&&E.resolveStencilBuffer&&(ee|=n.STENCIL_BUFFER_BIT)),Z){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,ce.__webglColorRenderbuffer[pe]);const xe=i.get(_[pe]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,xe,0)}n.blitFramebuffer(0,0,B,j,0,0,B,j,ee,n.NEAREST),c===!0&&(gt.length=0,Kt.length=0,gt.push(n.COLOR_ATTACHMENT0+pe),E.depthBuffer&&E.resolveDepthBuffer===!1&&(gt.push(ne),Kt.push(ne),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,Kt)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,gt))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),Z)for(let pe=0;pe<_.length;pe++){t.bindFramebuffer(n.FRAMEBUFFER,ce.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+pe,n.RENDERBUFFER,ce.__webglColorRenderbuffer[pe]);const xe=i.get(_[pe]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,ce.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+pe,n.TEXTURE_2D,xe,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,ce.__webglMultisampledFramebuffer)}else if(E.depthBuffer&&E.resolveDepthBuffer===!1&&c){const _=E.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[_])}}}function Pt(E){return Math.min(s.maxSamples,E.samples)}function je(E){const _=i.get(E);return E.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&_.__useRenderToTexture!==!1}function ut(E){const _=o.render.frame;u.get(E)!==_&&(u.set(E,_),E.update())}function ue(E,_){const B=E.colorSpace,j=E.format,ee=E.type;return E.isCompressedTexture===!0||E.isVideoTexture===!0||B!==sn&&B!==oi&&(Ze.getTransfer(B)===Qe?(j!==un||ee!==tn)&&be("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Pe("WebGLTextures: Unsupported texture color space:",B)),_}function vt(E){return typeof HTMLImageElement<"u"&&E instanceof HTMLImageElement?(l.width=E.naturalWidth||E.width,l.height=E.naturalHeight||E.height):typeof VideoFrame<"u"&&E instanceof VideoFrame?(l.width=E.displayWidth,l.height=E.displayHeight):(l.width=E.width,l.height=E.height),l}this.allocateTextureUnit=I,this.resetTextureUnits=H,this.getTextureUnits=X,this.setTextureUnits=N,this.setTexture2D=W,this.setTexture2DArray=J,this.setTexture3D=re,this.setTextureCube=_e,this.rebindTextures=dt,this.setupRenderTarget=Xe,this.updateRenderTargetMipmap=Ct,this.updateMultisampleRenderTarget=U,this.setupDepthRenderbuffer=it,this.setupFrameBufferTexture=Ie,this.useMultisampledRTT=je,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function aE(n,e){function t(i,s=oi){let r;const o=Ze.getTransfer(s);if(i===tn)return n.UNSIGNED_BYTE;if(i===Tc)return n.UNSIGNED_SHORT_4_4_4_4;if(i===Ac)return n.UNSIGNED_SHORT_5_5_5_1;if(i===od)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===ad)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===sd)return n.BYTE;if(i===rd)return n.SHORT;if(i===Ws)return n.UNSIGNED_SHORT;if(i===Ec)return n.INT;if(i===Pn)return n.UNSIGNED_INT;if(i===ln)return n.FLOAT;if(i===Zn)return n.HALF_FLOAT;if(i===cd)return n.ALPHA;if(i===ld)return n.RGB;if(i===un)return n.RGBA;if(i===$n)return n.DEPTH_COMPONENT;if(i===bi)return n.DEPTH_STENCIL;if(i===wc)return n.RED;if(i===Rc)return n.RED_INTEGER;if(i===Ri)return n.RG;if(i===Cc)return n.RG_INTEGER;if(i===Pc)return n.RGBA_INTEGER;if(i===Dr||i===Ur||i===Or||i===Fr)if(o===Qe)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===Dr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Ur)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Or)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Fr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===Dr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Ur)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Or)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Fr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===wa||i===Ra||i===Ca||i===Pa)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===wa)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Ra)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Ca)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Pa)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Ia||i===La||i===Na||i===Da||i===Ua||i===Xr||i===Oa)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(i===Ia||i===La)return o===Qe?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===Na)return o===Qe?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(i===Da)return r.COMPRESSED_R11_EAC;if(i===Ua)return r.COMPRESSED_SIGNED_R11_EAC;if(i===Xr)return r.COMPRESSED_RG11_EAC;if(i===Oa)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===Fa||i===za||i===Ba||i===ka||i===Ga||i===Ha||i===Va||i===Wa||i===Xa||i===Za||i===$a||i===qa||i===ja||i===Ya)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(i===Fa)return o===Qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===za)return o===Qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Ba)return o===Qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===ka)return o===Qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Ga)return o===Qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Ha)return o===Qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Va)return o===Qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Wa)return o===Qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Xa)return o===Qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Za)return o===Qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===$a)return o===Qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===qa)return o===Qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===ja)return o===Qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Ya)return o===Qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Ka||i===Ja||i===Qa)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(i===Ka)return o===Qe?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Ja)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Qa)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===ec||i===tc||i===Zr||i===nc)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(i===ec)return r.COMPRESSED_RED_RGTC1_EXT;if(i===tc)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Zr)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===nc)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Xs?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}const cE=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,lE=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class uE{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const i=new Sd(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new In({vertexShader:cE,fragmentShader:lE,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Be(new Ys(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class hE extends Pi{constructor(e,t){super();const i=this;let s=null,r=1,o=null,a="local-floor",c=1,l=null,u=null,d=null,h=null,f=null,g=null;const x=typeof XRWebGLBinding<"u",m=new uE,p={},S=t.getContextAttributes();let b=null,y=null;const w=[],T=[],C=new Ye;let v=null;const A=new Zt;A.viewport=new lt;const L=new Zt;L.viewport=new lt;const R=[A,L],O=new dx;let H=null,X=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(q){let le=w[q];return le===void 0&&(le=new wo,w[q]=le),le.getTargetRaySpace()},this.getControllerGrip=function(q){let le=w[q];return le===void 0&&(le=new wo,w[q]=le),le.getGripSpace()},this.getHand=function(q){let le=w[q];return le===void 0&&(le=new wo,w[q]=le),le.getHandSpace()};function N(q){const le=T.indexOf(q.inputSource);if(le===-1)return;const te=w[le];te!==void 0&&(te.update(q.inputSource,q.frame,l||o),te.dispatchEvent({type:q.type,data:q.inputSource}))}function I(){s.removeEventListener("select",N),s.removeEventListener("selectstart",N),s.removeEventListener("selectend",N),s.removeEventListener("squeeze",N),s.removeEventListener("squeezestart",N),s.removeEventListener("squeezeend",N),s.removeEventListener("end",I),s.removeEventListener("inputsourceschange",D);for(let q=0;q<w.length;q++){const le=T[q];le!==null&&(T[q]=null,w[q].disconnect(le))}H=null,X=null,m.reset();for(const q in p)delete p[q];e.setRenderTarget(b),f=null,h=null,d=null,s=null,y=null,Re.stop(),i.isPresenting=!1,e.setPixelRatio(v),e.setSize(C.width,C.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(q){r=q,i.isPresenting===!0&&be("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(q){a=q,i.isPresenting===!0&&be("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(q){l=q},this.getBaseLayer=function(){return h!==null?h:f},this.getBinding=function(){return d===null&&x&&(d=new XRWebGLBinding(s,t)),d},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(q){if(s=q,s!==null){if(b=e.getRenderTarget(),s.addEventListener("select",N),s.addEventListener("selectstart",N),s.addEventListener("selectend",N),s.addEventListener("squeeze",N),s.addEventListener("squeezestart",N),s.addEventListener("squeezeend",N),s.addEventListener("end",I),s.addEventListener("inputsourceschange",D),S.xrCompatible!==!0&&await t.makeXRCompatible(),v=e.getPixelRatio(),e.getSize(C),x&&"createProjectionLayer"in XRWebGLBinding.prototype){let te=null,Ce=null,Ue=null;S.depth&&(Ue=S.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,te=S.stencil?bi:$n,Ce=S.stencil?Xs:Pn);const Ie={colorFormat:t.RGBA8,depthFormat:Ue,scaleFactor:r};d=this.getBinding(),h=d.createProjectionLayer(Ie),s.updateRenderState({layers:[h]}),e.setPixelRatio(1),e.setSize(h.textureWidth,h.textureHeight,!1),y=new Rn(h.textureWidth,h.textureHeight,{format:un,type:tn,depthTexture:new ds(h.textureWidth,h.textureHeight,Ce,void 0,void 0,void 0,void 0,void 0,void 0,te),stencilBuffer:S.stencil,colorSpace:e.outputColorSpace,samples:S.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1})}else{const te={antialias:S.antialias,alpha:!0,depth:S.depth,stencil:S.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,t,te),s.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),y=new Rn(f.framebufferWidth,f.framebufferHeight,{format:un,type:tn,colorSpace:e.outputColorSpace,stencilBuffer:S.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await s.requestReferenceSpace(a),Re.setContext(s),Re.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function D(q){for(let le=0;le<q.removed.length;le++){const te=q.removed[le],Ce=T.indexOf(te);Ce>=0&&(T[Ce]=null,w[Ce].disconnect(te))}for(let le=0;le<q.added.length;le++){const te=q.added[le];let Ce=T.indexOf(te);if(Ce===-1){for(let Ie=0;Ie<w.length;Ie++)if(Ie>=T.length){T.push(te),Ce=Ie;break}else if(T[Ie]===null){T[Ie]=te,Ce=Ie;break}if(Ce===-1)break}const Ue=w[Ce];Ue&&Ue.connect(te)}}const W=new z,J=new z;function re(q,le,te){W.setFromMatrixPosition(le.matrixWorld),J.setFromMatrixPosition(te.matrixWorld);const Ce=W.distanceTo(J),Ue=le.projectionMatrix.elements,Ie=te.projectionMatrix.elements,mt=Ue[14]/(Ue[10]-1),qe=Ue[14]/(Ue[10]+1),it=(Ue[9]+1)/Ue[5],dt=(Ue[9]-1)/Ue[5],Xe=(Ue[8]-1)/Ue[0],Ct=(Ie[8]+1)/Ie[0],gt=mt*Xe,Kt=mt*Ct,U=Ce/(-Xe+Ct),Pt=U*-Xe;if(le.matrixWorld.decompose(q.position,q.quaternion,q.scale),q.translateX(Pt),q.translateZ(U),q.matrixWorld.compose(q.position,q.quaternion,q.scale),q.matrixWorldInverse.copy(q.matrixWorld).invert(),Ue[10]===-1)q.projectionMatrix.copy(le.projectionMatrix),q.projectionMatrixInverse.copy(le.projectionMatrixInverse);else{const je=mt+U,ut=qe+U,ue=gt-Pt,vt=Kt+(Ce-Pt),E=it*qe/ut*je,_=dt*qe/ut*je;q.projectionMatrix.makePerspective(ue,vt,E,_,je,ut),q.projectionMatrixInverse.copy(q.projectionMatrix).invert()}}function _e(q,le){le===null?q.matrixWorld.copy(q.matrix):q.matrixWorld.multiplyMatrices(le.matrixWorld,q.matrix),q.matrixWorldInverse.copy(q.matrixWorld).invert()}this.updateCamera=function(q){if(s===null)return;let le=q.near,te=q.far;m.texture!==null&&(m.depthNear>0&&(le=m.depthNear),m.depthFar>0&&(te=m.depthFar)),O.near=L.near=A.near=le,O.far=L.far=A.far=te,(H!==O.near||X!==O.far)&&(s.updateRenderState({depthNear:O.near,depthFar:O.far}),H=O.near,X=O.far),O.layers.mask=q.layers.mask|6,A.layers.mask=O.layers.mask&-5,L.layers.mask=O.layers.mask&-3;const Ce=q.parent,Ue=O.cameras;_e(O,Ce);for(let Ie=0;Ie<Ue.length;Ie++)_e(Ue[Ie],Ce);Ue.length===2?re(O,A,L):O.projectionMatrix.copy(A.projectionMatrix),Se(q,O,Ce)};function Se(q,le,te){te===null?q.matrix.copy(le.matrixWorld):(q.matrix.copy(te.matrixWorld),q.matrix.invert(),q.matrix.multiply(le.matrixWorld)),q.matrix.decompose(q.position,q.quaternion,q.scale),q.updateMatrixWorld(!0),q.projectionMatrix.copy(le.projectionMatrix),q.projectionMatrixInverse.copy(le.projectionMatrixInverse),q.isPerspectiveCamera&&(q.fov=hs*2*Math.atan(1/q.projectionMatrix.elements[5]),q.zoom=1)}this.getCamera=function(){return O},this.getFoveation=function(){if(!(h===null&&f===null))return c},this.setFoveation=function(q){c=q,h!==null&&(h.fixedFoveation=q),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=q)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(O)},this.getCameraTexture=function(q){return p[q]};let ve=null;function Le(q,le){if(u=le.getViewerPose(l||o),g=le,u!==null){const te=u.views;f!==null&&(e.setRenderTargetFramebuffer(y,f.framebuffer),e.setRenderTarget(y));let Ce=!1;te.length!==O.cameras.length&&(O.cameras.length=0,Ce=!0);for(let qe=0;qe<te.length;qe++){const it=te[qe];let dt=null;if(f!==null)dt=f.getViewport(it);else{const Ct=d.getViewSubImage(h,it);dt=Ct.viewport,qe===0&&(e.setRenderTargetTextures(y,Ct.colorTexture,Ct.depthStencilTexture),e.setRenderTarget(y))}let Xe=R[qe];Xe===void 0&&(Xe=new Zt,Xe.layers.enable(qe),Xe.viewport=new lt,R[qe]=Xe),Xe.matrix.fromArray(it.transform.matrix),Xe.matrix.decompose(Xe.position,Xe.quaternion,Xe.scale),Xe.projectionMatrix.fromArray(it.projectionMatrix),Xe.projectionMatrixInverse.copy(Xe.projectionMatrix).invert(),Xe.viewport.set(dt.x,dt.y,dt.width,dt.height),qe===0&&(O.matrix.copy(Xe.matrix),O.matrix.decompose(O.position,O.quaternion,O.scale)),Ce===!0&&O.cameras.push(Xe)}const Ue=s.enabledFeatures;if(Ue&&Ue.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&x){d=i.getBinding();const qe=d.getDepthInformation(te[0]);qe&&qe.isValid&&qe.texture&&m.init(qe,s.renderState)}if(Ue&&Ue.includes("camera-access")&&x){e.state.unbindTexture(),d=i.getBinding();for(let qe=0;qe<te.length;qe++){const it=te[qe].camera;if(it){let dt=p[it];dt||(dt=new Sd,p[it]=dt);const Xe=d.getCameraImage(it);dt.sourceTexture=Xe}}}}for(let te=0;te<w.length;te++){const Ce=T[te],Ue=w[te];Ce!==null&&Ue!==void 0&&Ue.update(Ce,le,l||o)}ve&&ve(q,le),le.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:le}),g=null}const Re=new Pd;Re.setAnimationLoop(Le),this.setAnimationLoop=function(q){ve=q},this.dispose=function(){}}}const dE=new He,Fd=new Oe;Fd.set(-1,0,0,0,1,0,0,0,1);function fE(n,e){function t(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function i(m,p){p.color.getRGB(m.fogColor.value,yd(n)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function s(m,p,S,b,y){p.isNodeMaterial?p.uniformsNeedUpdate=!1:p.isMeshBasicMaterial?r(m,p):p.isMeshLambertMaterial?(r(m,p),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)):p.isMeshToonMaterial?(r(m,p),d(m,p)):p.isMeshPhongMaterial?(r(m,p),u(m,p),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)):p.isMeshStandardMaterial?(r(m,p),h(m,p),p.isMeshPhysicalMaterial&&f(m,p,y)):p.isMeshMatcapMaterial?(r(m,p),g(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),x(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&a(m,p)):p.isPointsMaterial?c(m,p,S,b):p.isSpriteMaterial?l(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,t(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===jt&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,t(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===jt&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,t(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,t(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const S=e.get(p),b=S.envMap,y=S.envMapRotation;b&&(m.envMap.value=b,m.envMapRotation.value.setFromMatrix4(dE.makeRotationFromEuler(y)).transpose(),b.isCubeTexture&&b.isRenderTargetTexture===!1&&m.envMapRotation.value.premultiply(Fd),m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform))}function a(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function c(m,p,S,b){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*S,m.scale.value=b*.5,p.map&&(m.map.value=p.map,t(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function l(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function u(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function d(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function h(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,S){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===jt&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=S.texture,m.transmissionSamplerSize.value.set(S.width,S.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function x(m,p){const S=e.get(p).light;m.referencePosition.value.setFromMatrixPosition(S.matrixWorld),m.nearDistance.value=S.shadow.camera.near,m.farDistance.value=S.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function pE(n,e,t,i){let s={},r={},o=[];const a=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function c(S,b){const y=b.program;i.uniformBlockBinding(S,y)}function l(S,b){let y=s[S.id];y===void 0&&(g(S),y=u(S),s[S.id]=y,S.addEventListener("dispose",m));const w=b.program;i.updateUBOMapping(S,w);const T=e.render.frame;r[S.id]!==T&&(h(S),r[S.id]=T)}function u(S){const b=d();S.__bindingPointIndex=b;const y=n.createBuffer(),w=S.__size,T=S.usage;return n.bindBuffer(n.UNIFORM_BUFFER,y),n.bufferData(n.UNIFORM_BUFFER,w,T),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,b,y),y}function d(){for(let S=0;S<a;S++)if(o.indexOf(S)===-1)return o.push(S),S;return Pe("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(S){const b=s[S.id],y=S.uniforms,w=S.__cache;n.bindBuffer(n.UNIFORM_BUFFER,b);for(let T=0,C=y.length;T<C;T++){const v=Array.isArray(y[T])?y[T]:[y[T]];for(let A=0,L=v.length;A<L;A++){const R=v[A];if(f(R,T,A,w)===!0){const O=R.__offset,H=Array.isArray(R.value)?R.value:[R.value];let X=0;for(let N=0;N<H.length;N++){const I=H[N],D=x(I);typeof I=="number"||typeof I=="boolean"?(R.__data[0]=I,n.bufferSubData(n.UNIFORM_BUFFER,O+X,R.__data)):I.isMatrix3?(R.__data[0]=I.elements[0],R.__data[1]=I.elements[1],R.__data[2]=I.elements[2],R.__data[3]=0,R.__data[4]=I.elements[3],R.__data[5]=I.elements[4],R.__data[6]=I.elements[5],R.__data[7]=0,R.__data[8]=I.elements[6],R.__data[9]=I.elements[7],R.__data[10]=I.elements[8],R.__data[11]=0):ArrayBuffer.isView(I)?R.__data.set(new I.constructor(I.buffer,I.byteOffset,R.__data.length)):(I.toArray(R.__data,X),X+=D.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,O,R.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function f(S,b,y,w){const T=S.value,C=b+"_"+y;if(w[C]===void 0)return typeof T=="number"||typeof T=="boolean"?w[C]=T:ArrayBuffer.isView(T)?w[C]=T.slice():w[C]=T.clone(),!0;{const v=w[C];if(typeof T=="number"||typeof T=="boolean"){if(v!==T)return w[C]=T,!0}else{if(ArrayBuffer.isView(T))return!0;if(v.equals(T)===!1)return v.copy(T),!0}}return!1}function g(S){const b=S.uniforms;let y=0;const w=16;for(let C=0,v=b.length;C<v;C++){const A=Array.isArray(b[C])?b[C]:[b[C]];for(let L=0,R=A.length;L<R;L++){const O=A[L],H=Array.isArray(O.value)?O.value:[O.value];for(let X=0,N=H.length;X<N;X++){const I=H[X],D=x(I),W=y%w,J=W%D.boundary,re=W+J;y+=J,re!==0&&w-re<D.storage&&(y+=w-re),O.__data=new Float32Array(D.storage/Float32Array.BYTES_PER_ELEMENT),O.__offset=y,y+=D.storage}}}const T=y%w;return T>0&&(y+=w-T),S.__size=y,S.__cache={},this}function x(S){const b={boundary:0,storage:0};return typeof S=="number"||typeof S=="boolean"?(b.boundary=4,b.storage=4):S.isVector2?(b.boundary=8,b.storage=8):S.isVector3||S.isColor?(b.boundary=16,b.storage=12):S.isVector4?(b.boundary=16,b.storage=16):S.isMatrix3?(b.boundary=48,b.storage=48):S.isMatrix4?(b.boundary=64,b.storage=64):S.isTexture?be("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(S)?(b.boundary=16,b.storage=S.byteLength):be("WebGLRenderer: Unsupported uniform value type.",S),b}function m(S){const b=S.target;b.removeEventListener("dispose",m);const y=o.indexOf(b.__bindingPointIndex);o.splice(y,1),n.deleteBuffer(s[b.id]),delete s[b.id],delete r[b.id]}function p(){for(const S in s)n.deleteBuffer(s[S]);o=[],s={},r={}}return{bind:c,update:l,dispose:p}}const mE=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let yn=null;function gE(){return yn===null&&(yn=new Fc(mE,16,16,Ri,Zn),yn.name="DFG_LUT",yn.minFilter=Lt,yn.magFilter=Lt,yn.wrapS=Tn,yn.wrapT=Tn,yn.generateMipmaps=!1,yn.needsUpdate=!0),yn}class _E{constructor(e={}){const{canvas:t=k0(),context:i=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:h=!1,outputBufferType:f=tn}=e;this.isWebGLRenderer=!0;let g;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=i.getContextAttributes().alpha}else g=o;const x=f,m=new Set([Pc,Cc,Rc]),p=new Set([tn,Pn,Ws,Xs,Tc,Ac]),S=new Uint32Array(4),b=new Int32Array(4),y=new z;let w=null,T=null;const C=[],v=[];let A=null;this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=wn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const L=this;let R=!1,O=null;this._outputColorSpace=bt;let H=0,X=0,N=null,I=-1,D=null;const W=new lt,J=new lt;let re=null;const _e=new Ne(0);let Se=0,ve=t.width,Le=t.height,Re=1,q=null,le=null;const te=new lt(0,0,ve,Le),Ce=new lt(0,0,ve,Le);let Ue=!1;const Ie=new Bc;let mt=!1,qe=!1;const it=new He,dt=new z,Xe=new lt,Ct={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let gt=!1;function Kt(){return N===null?Re:1}let U=i;function Pt(M,F){return t.getContext(M,F)}try{const M={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:u,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${bc}`),t.addEventListener("webglcontextlost",Q,!1),t.addEventListener("webglcontextrestored",Ee,!1),t.addEventListener("webglcontextcreationerror",Fe,!1),U===null){const F="webgl2";if(U=Pt(F,M),U===null)throw Pt(F)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(M){throw Pe("WebGLRenderer: "+M.message),M}let je,ut,ue,vt,E,_,B,j,ee,ne,ce,Z,K,pe,xe,oe,ie,De,ke,Je,P,se,$;function me(){je=new gy(U),je.init(),P=new aE(U,je),ut=new cy(U,je,e,P),ue=new rE(U,je),ut.reversedDepthBuffer&&h&&ue.buffers.depth.setReversed(!0),vt=new xy(U),E=new Xb,_=new oE(U,je,ue,E,ut,P,vt),B=new my(L),j=new bx(U),se=new oy(U,j),ee=new _y(U,j,vt,se),ne=new Sy(U,ee,j,se,vt),De=new My(U,ut,_),xe=new ly(E),ce=new Wb(L,B,je,ut,se,xe),Z=new fE(L,E),K=new $b,pe=new Qb(je),ie=new ry(L,B,ue,ne,g,c),oe=new sE(L,ne,ut),$=new pE(U,vt,ut,ue),ke=new ay(U,je,vt),Je=new vy(U,je,vt),vt.programs=ce.programs,L.capabilities=ut,L.extensions=je,L.properties=E,L.renderLists=K,L.shadowMap=oe,L.state=ue,L.info=vt}me(),x!==tn&&(A=new by(x,t.width,t.height,s,r));const ae=new hE(L,U);this.xr=ae,this.getContext=function(){return U},this.getContextAttributes=function(){return U.getContextAttributes()},this.forceContextLoss=function(){const M=je.get("WEBGL_lose_context");M&&M.loseContext()},this.forceContextRestore=function(){const M=je.get("WEBGL_lose_context");M&&M.restoreContext()},this.getPixelRatio=function(){return Re},this.setPixelRatio=function(M){M!==void 0&&(Re=M,this.setSize(ve,Le,!1))},this.getSize=function(M){return M.set(ve,Le)},this.setSize=function(M,F,V=!0){if(ae.isPresenting){be("WebGLRenderer: Can't change size while VR device is presenting.");return}ve=M,Le=F,t.width=Math.floor(M*Re),t.height=Math.floor(F*Re),V===!0&&(t.style.width=M+"px",t.style.height=F+"px"),A!==null&&A.setSize(t.width,t.height),this.setViewport(0,0,M,F)},this.getDrawingBufferSize=function(M){return M.set(ve*Re,Le*Re).floor()},this.setDrawingBufferSize=function(M,F,V){ve=M,Le=F,Re=V,t.width=Math.floor(M*V),t.height=Math.floor(F*V),this.setViewport(0,0,M,F)},this.setEffects=function(M){if(x===tn){Pe("THREE.WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(M){for(let F=0;F<M.length;F++)if(M[F].isOutputPass===!0){be("THREE.WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}A.setEffects(M||[])},this.getCurrentViewport=function(M){return M.copy(W)},this.getViewport=function(M){return M.copy(te)},this.setViewport=function(M,F,V,k){M.isVector4?te.set(M.x,M.y,M.z,M.w):te.set(M,F,V,k),ue.viewport(W.copy(te).multiplyScalar(Re).round())},this.getScissor=function(M){return M.copy(Ce)},this.setScissor=function(M,F,V,k){M.isVector4?Ce.set(M.x,M.y,M.z,M.w):Ce.set(M,F,V,k),ue.scissor(J.copy(Ce).multiplyScalar(Re).round())},this.getScissorTest=function(){return Ue},this.setScissorTest=function(M){ue.setScissorTest(Ue=M)},this.setOpaqueSort=function(M){q=M},this.setTransparentSort=function(M){le=M},this.getClearColor=function(M){return M.copy(ie.getClearColor())},this.setClearColor=function(){ie.setClearColor(...arguments)},this.getClearAlpha=function(){return ie.getClearAlpha()},this.setClearAlpha=function(){ie.setClearAlpha(...arguments)},this.clear=function(M=!0,F=!0,V=!0){let k=0;if(M){let G=!1;if(N!==null){const fe=N.texture.format;G=m.has(fe)}if(G){const fe=N.texture.type,Me=p.has(fe),de=ie.getClearColor(),ye=ie.getClearAlpha(),Te=de.r,ze=de.g,Ve=de.b;Me?(S[0]=Te,S[1]=ze,S[2]=Ve,S[3]=ye,U.clearBufferuiv(U.COLOR,0,S)):(b[0]=Te,b[1]=ze,b[2]=Ve,b[3]=ye,U.clearBufferiv(U.COLOR,0,b))}else k|=U.COLOR_BUFFER_BIT}F&&(k|=U.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),V&&(k|=U.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),k!==0&&U.clear(k)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(M){M.setRenderer(this),O=M},this.dispose=function(){t.removeEventListener("webglcontextlost",Q,!1),t.removeEventListener("webglcontextrestored",Ee,!1),t.removeEventListener("webglcontextcreationerror",Fe,!1),ie.dispose(),K.dispose(),pe.dispose(),E.dispose(),B.dispose(),ne.dispose(),se.dispose(),$.dispose(),ce.dispose(),ae.dispose(),ae.removeEventListener("sessionstart",Wc),ae.removeEventListener("sessionend",Xc),fi.stop()};function Q(M){M.preventDefault(),qr("WebGLRenderer: Context Lost."),R=!0}function Ee(){qr("WebGLRenderer: Context Restored."),R=!1;const M=vt.autoReset,F=oe.enabled,V=oe.autoUpdate,k=oe.needsUpdate,G=oe.type;me(),vt.autoReset=M,oe.enabled=F,oe.autoUpdate=V,oe.needsUpdate=k,oe.type=G}function Fe(M){Pe("WebGLRenderer: A WebGL context could not be created. Reason: ",M.statusMessage)}function Mt(M){const F=M.target;F.removeEventListener("dispose",Mt),st(F)}function st(M){Dn(M),E.remove(M)}function Dn(M){const F=E.get(M).programs;F!==void 0&&(F.forEach(function(V){ce.releaseProgram(V)}),M.isShaderMaterial&&ce.releaseShaderCache(M))}this.renderBufferDirect=function(M,F,V,k,G,fe){F===null&&(F=Ct);const Me=G.isMesh&&G.matrixWorld.determinant()<0,de=ef(M,F,V,k,G);ue.setMaterial(k,Me);let ye=V.index,Te=1;if(k.wireframe===!0){if(ye=ee.getWireframeAttribute(V),ye===void 0)return;Te=2}const ze=V.drawRange,Ve=V.attributes.position;let Ae=ze.start*Te,rt=(ze.start+ze.count)*Te;fe!==null&&(Ae=Math.max(Ae,fe.start*Te),rt=Math.min(rt,(fe.start+fe.count)*Te)),ye!==null?(Ae=Math.max(Ae,0),rt=Math.min(rt,ye.count)):Ve!=null&&(Ae=Math.max(Ae,0),rt=Math.min(rt,Ve.count));const St=rt-Ae;if(St<0||St===1/0)return;se.setup(G,k,de,V,ye);let xt,at=ke;if(ye!==null&&(xt=j.get(ye),at=Je,at.setIndex(xt)),G.isMesh)k.wireframe===!0?(ue.setLineWidth(k.wireframeLinewidth*Kt()),at.setMode(U.LINES)):at.setMode(U.TRIANGLES);else if(G.isLine){let kt=k.linewidth;kt===void 0&&(kt=1),ue.setLineWidth(kt*Kt()),G.isLineSegments?at.setMode(U.LINES):G.isLineLoop?at.setMode(U.LINE_LOOP):at.setMode(U.LINE_STRIP)}else G.isPoints?at.setMode(U.POINTS):G.isSprite&&at.setMode(U.TRIANGLES);if(G.isBatchedMesh)if(je.get("WEBGL_multi_draw"))at.renderMultiDraw(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount);else{const kt=G._multiDrawStarts,ge=G._multiDrawCounts,Jt=G._multiDrawCount,Ke=ye?j.get(ye).bytesPerElement:1,rn=E.get(k).currentProgram.getUniforms();for(let Mn=0;Mn<Jt;Mn++)rn.setValue(U,"_gl_DrawID",Mn),at.render(kt[Mn]/Ke,ge[Mn])}else if(G.isInstancedMesh)at.renderInstances(Ae,St,G.count);else if(V.isInstancedBufferGeometry){const kt=V._maxInstanceCount!==void 0?V._maxInstanceCount:1/0,ge=Math.min(V.instanceCount,kt);at.renderInstances(Ae,St,ge)}else at.render(Ae,St)};function xn(M,F,V){M.transparent===!0&&M.side===Ft&&M.forceSinglePass===!1?(M.side=jt,M.needsUpdate=!0,Js(M,F,V),M.side=Xn,M.needsUpdate=!0,Js(M,F,V),M.side=Ft):Js(M,F,V)}this.compile=function(M,F,V=null){V===null&&(V=M),T=pe.get(V),T.init(F),v.push(T),V.traverseVisible(function(G){G.isLight&&G.layers.test(F.layers)&&(T.pushLight(G),G.castShadow&&T.pushShadow(G))}),M!==V&&M.traverseVisible(function(G){G.isLight&&G.layers.test(F.layers)&&(T.pushLight(G),G.castShadow&&T.pushShadow(G))}),T.setupLights();const k=new Set;return M.traverse(function(G){if(!(G.isMesh||G.isPoints||G.isLine||G.isSprite))return;const fe=G.material;if(fe)if(Array.isArray(fe))for(let Me=0;Me<fe.length;Me++){const de=fe[Me];xn(de,V,G),k.add(de)}else xn(fe,V,G),k.add(fe)}),T=v.pop(),k},this.compileAsync=function(M,F,V=null){const k=this.compile(M,F,V);return new Promise(G=>{function fe(){if(k.forEach(function(Me){E.get(Me).currentProgram.isReady()&&k.delete(Me)}),k.size===0){G(M);return}setTimeout(fe,10)}je.get("KHR_parallel_shader_compile")!==null?fe():setTimeout(fe,10)})};let uo=null;function Jd(M){uo&&uo(M)}function Wc(){fi.stop()}function Xc(){fi.start()}const fi=new Pd;fi.setAnimationLoop(Jd),typeof self<"u"&&fi.setContext(self),this.setAnimationLoop=function(M){uo=M,ae.setAnimationLoop(M),M===null?fi.stop():fi.start()},ae.addEventListener("sessionstart",Wc),ae.addEventListener("sessionend",Xc),this.render=function(M,F){if(F!==void 0&&F.isCamera!==!0){Pe("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(R===!0)return;O!==null&&O.renderStart(M,F);const V=ae.enabled===!0&&ae.isPresenting===!0,k=A!==null&&(N===null||V)&&A.begin(L,N);if(M.matrixWorldAutoUpdate===!0&&M.updateMatrixWorld(),F.parent===null&&F.matrixWorldAutoUpdate===!0&&F.updateMatrixWorld(),ae.enabled===!0&&ae.isPresenting===!0&&(A===null||A.isCompositing()===!1)&&(ae.cameraAutoUpdate===!0&&ae.updateCamera(F),F=ae.getCamera()),M.isScene===!0&&M.onBeforeRender(L,M,F,N),T=pe.get(M,v.length),T.init(F),T.state.textureUnits=_.getTextureUnits(),v.push(T),it.multiplyMatrices(F.projectionMatrix,F.matrixWorldInverse),Ie.setFromProjectionMatrix(it,An,F.reversedDepth),qe=this.localClippingEnabled,mt=xe.init(this.clippingPlanes,qe),w=K.get(M,C.length),w.init(),C.push(w),ae.enabled===!0&&ae.isPresenting===!0){const Me=L.xr.getDepthSensingMesh();Me!==null&&ho(Me,F,-1/0,L.sortObjects)}ho(M,F,0,L.sortObjects),w.finish(),L.sortObjects===!0&&w.sort(q,le),gt=ae.enabled===!1||ae.isPresenting===!1||ae.hasDepthSensing()===!1,gt&&ie.addToRenderList(w,M),this.info.render.frame++,mt===!0&&xe.beginShadows();const G=T.state.shadowsArray;if(oe.render(G,M,F),mt===!0&&xe.endShadows(),this.info.autoReset===!0&&this.info.reset(),(k&&A.hasRenderPass())===!1){const Me=w.opaque,de=w.transmissive;if(T.setupLights(),F.isArrayCamera){const ye=F.cameras;if(de.length>0)for(let Te=0,ze=ye.length;Te<ze;Te++){const Ve=ye[Te];$c(Me,de,M,Ve)}gt&&ie.render(M);for(let Te=0,ze=ye.length;Te<ze;Te++){const Ve=ye[Te];Zc(w,M,Ve,Ve.viewport)}}else de.length>0&&$c(Me,de,M,F),gt&&ie.render(M),Zc(w,M,F)}N!==null&&X===0&&(_.updateMultisampleRenderTarget(N),_.updateRenderTargetMipmap(N)),k&&A.end(L),M.isScene===!0&&M.onAfterRender(L,M,F),se.resetDefaultState(),I=-1,D=null,v.pop(),v.length>0?(T=v[v.length-1],_.setTextureUnits(T.state.textureUnits),mt===!0&&xe.setGlobalState(L.clippingPlanes,T.state.camera)):T=null,C.pop(),C.length>0?w=C[C.length-1]:w=null,O!==null&&O.renderEnd()};function ho(M,F,V,k){if(M.visible===!1)return;if(M.layers.test(F.layers)){if(M.isGroup)V=M.renderOrder;else if(M.isLOD)M.autoUpdate===!0&&M.update(F);else if(M.isLightProbeGrid)T.pushLightProbeGrid(M);else if(M.isLight)T.pushLight(M),M.castShadow&&T.pushShadow(M);else if(M.isSprite){if(!M.frustumCulled||Ie.intersectsSprite(M)){k&&Xe.setFromMatrixPosition(M.matrixWorld).applyMatrix4(it);const Me=ne.update(M),de=M.material;de.visible&&w.push(M,Me,de,V,Xe.z,null)}}else if((M.isMesh||M.isLine||M.isPoints)&&(!M.frustumCulled||Ie.intersectsObject(M))){const Me=ne.update(M),de=M.material;if(k&&(M.boundingSphere!==void 0?(M.boundingSphere===null&&M.computeBoundingSphere(),Xe.copy(M.boundingSphere.center)):(Me.boundingSphere===null&&Me.computeBoundingSphere(),Xe.copy(Me.boundingSphere.center)),Xe.applyMatrix4(M.matrixWorld).applyMatrix4(it)),Array.isArray(de)){const ye=Me.groups;for(let Te=0,ze=ye.length;Te<ze;Te++){const Ve=ye[Te],Ae=de[Ve.materialIndex];Ae&&Ae.visible&&w.push(M,Me,Ae,V,Xe.z,Ve)}}else de.visible&&w.push(M,Me,de,V,Xe.z,null)}}const fe=M.children;for(let Me=0,de=fe.length;Me<de;Me++)ho(fe[Me],F,V,k)}function Zc(M,F,V,k){const{opaque:G,transmissive:fe,transparent:Me}=M;T.setupLightsView(V),mt===!0&&xe.setGlobalState(L.clippingPlanes,V),k&&ue.viewport(W.copy(k)),G.length>0&&Ks(G,F,V),fe.length>0&&Ks(fe,F,V),Me.length>0&&Ks(Me,F,V),ue.buffers.depth.setTest(!0),ue.buffers.depth.setMask(!0),ue.buffers.color.setMask(!0),ue.setPolygonOffset(!1)}function $c(M,F,V,k){if((V.isScene===!0?V.overrideMaterial:null)!==null)return;if(T.state.transmissionRenderTarget[k.id]===void 0){const Ae=je.has("EXT_color_buffer_half_float")||je.has("EXT_color_buffer_float");T.state.transmissionRenderTarget[k.id]=new Rn(1,1,{generateMipmaps:!0,type:Ae?Zn:tn,minFilter:Gn,samples:Math.max(4,ut.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Ze.workingColorSpace})}const fe=T.state.transmissionRenderTarget[k.id],Me=k.viewport||W;fe.setSize(Me.z*L.transmissionResolutionScale,Me.w*L.transmissionResolutionScale);const de=L.getRenderTarget(),ye=L.getActiveCubeFace(),Te=L.getActiveMipmapLevel();L.setRenderTarget(fe),L.getClearColor(_e),Se=L.getClearAlpha(),Se<1&&L.setClearColor(16777215,.5),L.clear(),gt&&ie.render(V);const ze=L.toneMapping;L.toneMapping=wn;const Ve=k.viewport;if(k.viewport!==void 0&&(k.viewport=void 0),T.setupLightsView(k),mt===!0&&xe.setGlobalState(L.clippingPlanes,k),Ks(M,V,k),_.updateMultisampleRenderTarget(fe),_.updateRenderTargetMipmap(fe),je.has("WEBGL_multisampled_render_to_texture")===!1){let Ae=!1;for(let rt=0,St=F.length;rt<St;rt++){const xt=F[rt],{object:at,geometry:kt,material:ge,group:Jt}=xt;if(ge.side===Ft&&at.layers.test(k.layers)){const Ke=ge.side;ge.side=jt,ge.needsUpdate=!0,qc(at,V,k,kt,ge,Jt),ge.side=Ke,ge.needsUpdate=!0,Ae=!0}}Ae===!0&&(_.updateMultisampleRenderTarget(fe),_.updateRenderTargetMipmap(fe))}L.setRenderTarget(de,ye,Te),L.setClearColor(_e,Se),Ve!==void 0&&(k.viewport=Ve),L.toneMapping=ze}function Ks(M,F,V){const k=F.isScene===!0?F.overrideMaterial:null;for(let G=0,fe=M.length;G<fe;G++){const Me=M[G],{object:de,geometry:ye,group:Te}=Me;let ze=Me.material;ze.allowOverride===!0&&k!==null&&(ze=k),de.layers.test(V.layers)&&qc(de,F,V,ye,ze,Te)}}function qc(M,F,V,k,G,fe){M.onBeforeRender(L,F,V,k,G,fe),M.modelViewMatrix.multiplyMatrices(V.matrixWorldInverse,M.matrixWorld),M.normalMatrix.getNormalMatrix(M.modelViewMatrix),G.onBeforeRender(L,F,V,k,M,fe),G.transparent===!0&&G.side===Ft&&G.forceSinglePass===!1?(G.side=jt,G.needsUpdate=!0,L.renderBufferDirect(V,F,k,G,M,fe),G.side=Xn,G.needsUpdate=!0,L.renderBufferDirect(V,F,k,G,M,fe),G.side=Ft):L.renderBufferDirect(V,F,k,G,M,fe),M.onAfterRender(L,F,V,k,G,fe)}function Js(M,F,V){F.isScene!==!0&&(F=Ct);const k=E.get(M),G=T.state.lights,fe=T.state.shadowsArray,Me=G.state.version,de=ce.getParameters(M,G.state,fe,F,V,T.state.lightProbeGridArray),ye=ce.getProgramCacheKey(de);let Te=k.programs;k.environment=M.isMeshStandardMaterial||M.isMeshLambertMaterial||M.isMeshPhongMaterial?F.environment:null,k.fog=F.fog;const ze=M.isMeshStandardMaterial||M.isMeshLambertMaterial&&!M.envMap||M.isMeshPhongMaterial&&!M.envMap;k.envMap=B.get(M.envMap||k.environment,ze),k.envMapRotation=k.environment!==null&&M.envMap===null?F.environmentRotation:M.envMapRotation,Te===void 0&&(M.addEventListener("dispose",Mt),Te=new Map,k.programs=Te);let Ve=Te.get(ye);if(Ve!==void 0){if(k.currentProgram===Ve&&k.lightsStateVersion===Me)return Yc(M,de),Ve}else de.uniforms=ce.getUniforms(M),O!==null&&M.isNodeMaterial&&O.build(M,V,de),M.onBeforeCompile(de,L),Ve=ce.acquireProgram(de,ye),Te.set(ye,Ve),k.uniforms=de.uniforms;const Ae=k.uniforms;return(!M.isShaderMaterial&&!M.isRawShaderMaterial||M.clipping===!0)&&(Ae.clippingPlanes=xe.uniform),Yc(M,de),k.needsLights=nf(M),k.lightsStateVersion=Me,k.needsLights&&(Ae.ambientLightColor.value=G.state.ambient,Ae.lightProbe.value=G.state.probe,Ae.directionalLights.value=G.state.directional,Ae.directionalLightShadows.value=G.state.directionalShadow,Ae.spotLights.value=G.state.spot,Ae.spotLightShadows.value=G.state.spotShadow,Ae.rectAreaLights.value=G.state.rectArea,Ae.ltc_1.value=G.state.rectAreaLTC1,Ae.ltc_2.value=G.state.rectAreaLTC2,Ae.pointLights.value=G.state.point,Ae.pointLightShadows.value=G.state.pointShadow,Ae.hemisphereLights.value=G.state.hemi,Ae.directionalShadowMatrix.value=G.state.directionalShadowMatrix,Ae.spotLightMatrix.value=G.state.spotLightMatrix,Ae.spotLightMap.value=G.state.spotLightMap,Ae.pointShadowMatrix.value=G.state.pointShadowMatrix),k.lightProbeGrid=T.state.lightProbeGridArray.length>0,k.currentProgram=Ve,k.uniformsList=null,Ve}function jc(M){if(M.uniformsList===null){const F=M.currentProgram.getUniforms();M.uniformsList=zr.seqWithValue(F.seq,M.uniforms)}return M.uniformsList}function Yc(M,F){const V=E.get(M);V.outputColorSpace=F.outputColorSpace,V.batching=F.batching,V.batchingColor=F.batchingColor,V.instancing=F.instancing,V.instancingColor=F.instancingColor,V.instancingMorph=F.instancingMorph,V.skinning=F.skinning,V.morphTargets=F.morphTargets,V.morphNormals=F.morphNormals,V.morphColors=F.morphColors,V.morphTargetsCount=F.morphTargetsCount,V.numClippingPlanes=F.numClippingPlanes,V.numIntersection=F.numClipIntersection,V.vertexAlphas=F.vertexAlphas,V.vertexTangents=F.vertexTangents,V.toneMapping=F.toneMapping}function Qd(M,F){if(M.length===0)return null;if(M.length===1)return M[0].texture!==null?M[0]:null;y.setFromMatrixPosition(F.matrixWorld);for(let V=0,k=M.length;V<k;V++){const G=M[V];if(G.texture!==null&&G.boundingBox.containsPoint(y))return G}return null}function ef(M,F,V,k,G){F.isScene!==!0&&(F=Ct),_.resetTextureUnits();const fe=F.fog,Me=k.isMeshStandardMaterial||k.isMeshLambertMaterial||k.isMeshPhongMaterial?F.environment:null,de=N===null?L.outputColorSpace:N.isXRRenderTarget===!0?N.texture.colorSpace:Ze.workingColorSpace,ye=k.isMeshStandardMaterial||k.isMeshLambertMaterial&&!k.envMap||k.isMeshPhongMaterial&&!k.envMap,Te=B.get(k.envMap||Me,ye),ze=k.vertexColors===!0&&!!V.attributes.color&&V.attributes.color.itemSize===4,Ve=!!V.attributes.tangent&&(!!k.normalMap||k.anisotropy>0),Ae=!!V.morphAttributes.position,rt=!!V.morphAttributes.normal,St=!!V.morphAttributes.color;let xt=wn;k.toneMapped&&(N===null||N.isXRRenderTarget===!0)&&(xt=L.toneMapping);const at=V.morphAttributes.position||V.morphAttributes.normal||V.morphAttributes.color,kt=at!==void 0?at.length:0,ge=E.get(k),Jt=T.state.lights;if(mt===!0&&(qe===!0||M!==D)){const ht=M===D&&k.id===I;xe.setState(k,M,ht)}let Ke=!1;k.version===ge.__version?(ge.needsLights&&ge.lightsStateVersion!==Jt.state.version||ge.outputColorSpace!==de||G.isBatchedMesh&&ge.batching===!1||!G.isBatchedMesh&&ge.batching===!0||G.isBatchedMesh&&ge.batchingColor===!0&&G.colorTexture===null||G.isBatchedMesh&&ge.batchingColor===!1&&G.colorTexture!==null||G.isInstancedMesh&&ge.instancing===!1||!G.isInstancedMesh&&ge.instancing===!0||G.isSkinnedMesh&&ge.skinning===!1||!G.isSkinnedMesh&&ge.skinning===!0||G.isInstancedMesh&&ge.instancingColor===!0&&G.instanceColor===null||G.isInstancedMesh&&ge.instancingColor===!1&&G.instanceColor!==null||G.isInstancedMesh&&ge.instancingMorph===!0&&G.morphTexture===null||G.isInstancedMesh&&ge.instancingMorph===!1&&G.morphTexture!==null||ge.envMap!==Te||k.fog===!0&&ge.fog!==fe||ge.numClippingPlanes!==void 0&&(ge.numClippingPlanes!==xe.numPlanes||ge.numIntersection!==xe.numIntersection)||ge.vertexAlphas!==ze||ge.vertexTangents!==Ve||ge.morphTargets!==Ae||ge.morphNormals!==rt||ge.morphColors!==St||ge.toneMapping!==xt||ge.morphTargetsCount!==kt||!!ge.lightProbeGrid!=T.state.lightProbeGridArray.length>0)&&(Ke=!0):(Ke=!0,ge.__version=k.version);let rn=ge.currentProgram;Ke===!0&&(rn=Js(k,F,G),O&&k.isNodeMaterial&&O.onUpdateProgram(k,rn,ge));let Mn=!1,Yn=!1,Li=!1;const ct=rn.getUniforms(),yt=ge.uniforms;if(ue.useProgram(rn.program)&&(Mn=!0,Yn=!0,Li=!0),k.id!==I&&(I=k.id,Yn=!0),ge.needsLights){const ht=Qd(T.state.lightProbeGridArray,G);ge.lightProbeGrid!==ht&&(ge.lightProbeGrid=ht,Yn=!0)}if(Mn||D!==M){ue.buffers.depth.getReversed()&&M.reversedDepth!==!0&&(M._reversedDepth=!0,M.updateProjectionMatrix()),ct.setValue(U,"projectionMatrix",M.projectionMatrix),ct.setValue(U,"viewMatrix",M.matrixWorldInverse);const Jn=ct.map.cameraPosition;Jn!==void 0&&Jn.setValue(U,dt.setFromMatrixPosition(M.matrixWorld)),ut.logarithmicDepthBuffer&&ct.setValue(U,"logDepthBufFC",2/(Math.log(M.far+1)/Math.LN2)),(k.isMeshPhongMaterial||k.isMeshToonMaterial||k.isMeshLambertMaterial||k.isMeshBasicMaterial||k.isMeshStandardMaterial||k.isShaderMaterial)&&ct.setValue(U,"isOrthographic",M.isOrthographicCamera===!0),D!==M&&(D=M,Yn=!0,Li=!0)}if(ge.needsLights&&(Jt.state.directionalShadowMap.length>0&&ct.setValue(U,"directionalShadowMap",Jt.state.directionalShadowMap,_),Jt.state.spotShadowMap.length>0&&ct.setValue(U,"spotShadowMap",Jt.state.spotShadowMap,_),Jt.state.pointShadowMap.length>0&&ct.setValue(U,"pointShadowMap",Jt.state.pointShadowMap,_)),G.isSkinnedMesh){ct.setOptional(U,G,"bindMatrix"),ct.setOptional(U,G,"bindMatrixInverse");const ht=G.skeleton;ht&&(ht.boneTexture===null&&ht.computeBoneTexture(),ct.setValue(U,"boneTexture",ht.boneTexture,_))}G.isBatchedMesh&&(ct.setOptional(U,G,"batchingTexture"),ct.setValue(U,"batchingTexture",G._matricesTexture,_),ct.setOptional(U,G,"batchingIdTexture"),ct.setValue(U,"batchingIdTexture",G._indirectTexture,_),ct.setOptional(U,G,"batchingColorTexture"),G._colorsTexture!==null&&ct.setValue(U,"batchingColorTexture",G._colorsTexture,_));const Kn=V.morphAttributes;if((Kn.position!==void 0||Kn.normal!==void 0||Kn.color!==void 0)&&De.update(G,V,rn),(Yn||ge.receiveShadow!==G.receiveShadow)&&(ge.receiveShadow=G.receiveShadow,ct.setValue(U,"receiveShadow",G.receiveShadow)),(k.isMeshStandardMaterial||k.isMeshLambertMaterial||k.isMeshPhongMaterial)&&k.envMap===null&&F.environment!==null&&(yt.envMapIntensity.value=F.environmentIntensity),yt.dfgLUT!==void 0&&(yt.dfgLUT.value=gE()),Yn){if(ct.setValue(U,"toneMappingExposure",L.toneMappingExposure),ge.needsLights&&tf(yt,Li),fe&&k.fog===!0&&Z.refreshFogUniforms(yt,fe),Z.refreshMaterialUniforms(yt,k,Re,Le,T.state.transmissionRenderTarget[M.id]),ge.needsLights&&ge.lightProbeGrid){const ht=ge.lightProbeGrid;yt.probesSH.value=ht.texture,yt.probesMin.value.copy(ht.boundingBox.min),yt.probesMax.value.copy(ht.boundingBox.max),yt.probesResolution.value.copy(ht.resolution)}zr.upload(U,jc(ge),yt,_)}if(k.isShaderMaterial&&k.uniformsNeedUpdate===!0&&(zr.upload(U,jc(ge),yt,_),k.uniformsNeedUpdate=!1),k.isSpriteMaterial&&ct.setValue(U,"center",G.center),ct.setValue(U,"modelViewMatrix",G.modelViewMatrix),ct.setValue(U,"normalMatrix",G.normalMatrix),ct.setValue(U,"modelMatrix",G.matrixWorld),k.uniformsGroups!==void 0){const ht=k.uniformsGroups;for(let Jn=0,Ni=ht.length;Jn<Ni;Jn++){const Kc=ht[Jn];$.update(Kc,rn),$.bind(Kc,rn)}}return rn}function tf(M,F){M.ambientLightColor.needsUpdate=F,M.lightProbe.needsUpdate=F,M.directionalLights.needsUpdate=F,M.directionalLightShadows.needsUpdate=F,M.pointLights.needsUpdate=F,M.pointLightShadows.needsUpdate=F,M.spotLights.needsUpdate=F,M.spotLightShadows.needsUpdate=F,M.rectAreaLights.needsUpdate=F,M.hemisphereLights.needsUpdate=F}function nf(M){return M.isMeshLambertMaterial||M.isMeshToonMaterial||M.isMeshPhongMaterial||M.isMeshStandardMaterial||M.isShadowMaterial||M.isShaderMaterial&&M.lights===!0}this.getActiveCubeFace=function(){return H},this.getActiveMipmapLevel=function(){return X},this.getRenderTarget=function(){return N},this.setRenderTargetTextures=function(M,F,V){const k=E.get(M);k.__autoAllocateDepthBuffer=M.resolveDepthBuffer===!1,k.__autoAllocateDepthBuffer===!1&&(k.__useRenderToTexture=!1),E.get(M.texture).__webglTexture=F,E.get(M.depthTexture).__webglTexture=k.__autoAllocateDepthBuffer?void 0:V,k.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(M,F){const V=E.get(M);V.__webglFramebuffer=F,V.__useDefaultFramebuffer=F===void 0};const sf=U.createFramebuffer();this.setRenderTarget=function(M,F=0,V=0){N=M,H=F,X=V;let k=null,G=!1,fe=!1;if(M){const de=E.get(M);if(de.__useDefaultFramebuffer!==void 0){ue.bindFramebuffer(U.FRAMEBUFFER,de.__webglFramebuffer),W.copy(M.viewport),J.copy(M.scissor),re=M.scissorTest,ue.viewport(W),ue.scissor(J),ue.setScissorTest(re),I=-1;return}else if(de.__webglFramebuffer===void 0)_.setupRenderTarget(M);else if(de.__hasExternalTextures)_.rebindTextures(M,E.get(M.texture).__webglTexture,E.get(M.depthTexture).__webglTexture);else if(M.depthBuffer){const ze=M.depthTexture;if(de.__boundDepthTexture!==ze){if(ze!==null&&E.has(ze)&&(M.width!==ze.image.width||M.height!==ze.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");_.setupDepthRenderbuffer(M)}}const ye=M.texture;(ye.isData3DTexture||ye.isDataArrayTexture||ye.isCompressedArrayTexture)&&(fe=!0);const Te=E.get(M).__webglFramebuffer;M.isWebGLCubeRenderTarget?(Array.isArray(Te[F])?k=Te[F][V]:k=Te[F],G=!0):M.samples>0&&_.useMultisampledRTT(M)===!1?k=E.get(M).__webglMultisampledFramebuffer:Array.isArray(Te)?k=Te[V]:k=Te,W.copy(M.viewport),J.copy(M.scissor),re=M.scissorTest}else W.copy(te).multiplyScalar(Re).floor(),J.copy(Ce).multiplyScalar(Re).floor(),re=Ue;if(V!==0&&(k=sf),ue.bindFramebuffer(U.FRAMEBUFFER,k)&&ue.drawBuffers(M,k),ue.viewport(W),ue.scissor(J),ue.setScissorTest(re),G){const de=E.get(M.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_CUBE_MAP_POSITIVE_X+F,de.__webglTexture,V)}else if(fe){const de=F;for(let ye=0;ye<M.textures.length;ye++){const Te=E.get(M.textures[ye]);U.framebufferTextureLayer(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0+ye,Te.__webglTexture,V,de)}}else if(M!==null&&V!==0){const de=E.get(M.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,de.__webglTexture,V)}I=-1},this.readRenderTargetPixels=function(M,F,V,k,G,fe,Me,de=0){if(!(M&&M.isWebGLRenderTarget)){Pe("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ye=E.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&Me!==void 0&&(ye=ye[Me]),ye){ue.bindFramebuffer(U.FRAMEBUFFER,ye);try{const Te=M.textures[de],ze=Te.format,Ve=Te.type;if(M.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+de),!ut.textureFormatReadable(ze)){Pe("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!ut.textureTypeReadable(Ve)){Pe("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}F>=0&&F<=M.width-k&&V>=0&&V<=M.height-G&&U.readPixels(F,V,k,G,P.convert(ze),P.convert(Ve),fe)}finally{const Te=N!==null?E.get(N).__webglFramebuffer:null;ue.bindFramebuffer(U.FRAMEBUFFER,Te)}}},this.readRenderTargetPixelsAsync=async function(M,F,V,k,G,fe,Me,de=0){if(!(M&&M.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let ye=E.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&Me!==void 0&&(ye=ye[Me]),ye)if(F>=0&&F<=M.width-k&&V>=0&&V<=M.height-G){ue.bindFramebuffer(U.FRAMEBUFFER,ye);const Te=M.textures[de],ze=Te.format,Ve=Te.type;if(M.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+de),!ut.textureFormatReadable(ze))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!ut.textureTypeReadable(Ve))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Ae=U.createBuffer();U.bindBuffer(U.PIXEL_PACK_BUFFER,Ae),U.bufferData(U.PIXEL_PACK_BUFFER,fe.byteLength,U.STREAM_READ),U.readPixels(F,V,k,G,P.convert(ze),P.convert(Ve),0);const rt=N!==null?E.get(N).__webglFramebuffer:null;ue.bindFramebuffer(U.FRAMEBUFFER,rt);const St=U.fenceSync(U.SYNC_GPU_COMMANDS_COMPLETE,0);return U.flush(),await G0(U,St,4),U.bindBuffer(U.PIXEL_PACK_BUFFER,Ae),U.getBufferSubData(U.PIXEL_PACK_BUFFER,0,fe),U.deleteBuffer(Ae),U.deleteSync(St),fe}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(M,F=null,V=0){const k=Math.pow(2,-V),G=Math.floor(M.image.width*k),fe=Math.floor(M.image.height*k),Me=F!==null?F.x:0,de=F!==null?F.y:0;_.setTexture2D(M,0),U.copyTexSubImage2D(U.TEXTURE_2D,V,0,0,Me,de,G,fe),ue.unbindTexture()};const rf=U.createFramebuffer(),of=U.createFramebuffer();this.copyTextureToTexture=function(M,F,V=null,k=null,G=0,fe=0){let Me,de,ye,Te,ze,Ve,Ae,rt,St;const xt=M.isCompressedTexture?M.mipmaps[fe]:M.image;if(V!==null)Me=V.max.x-V.min.x,de=V.max.y-V.min.y,ye=V.isBox3?V.max.z-V.min.z:1,Te=V.min.x,ze=V.min.y,Ve=V.isBox3?V.min.z:0;else{const yt=Math.pow(2,-G);Me=Math.floor(xt.width*yt),de=Math.floor(xt.height*yt),M.isDataArrayTexture?ye=xt.depth:M.isData3DTexture?ye=Math.floor(xt.depth*yt):ye=1,Te=0,ze=0,Ve=0}k!==null?(Ae=k.x,rt=k.y,St=k.z):(Ae=0,rt=0,St=0);const at=P.convert(F.format),kt=P.convert(F.type);let ge;F.isData3DTexture?(_.setTexture3D(F,0),ge=U.TEXTURE_3D):F.isDataArrayTexture||F.isCompressedArrayTexture?(_.setTexture2DArray(F,0),ge=U.TEXTURE_2D_ARRAY):(_.setTexture2D(F,0),ge=U.TEXTURE_2D),ue.activeTexture(U.TEXTURE0),ue.pixelStorei(U.UNPACK_FLIP_Y_WEBGL,F.flipY),ue.pixelStorei(U.UNPACK_PREMULTIPLY_ALPHA_WEBGL,F.premultiplyAlpha),ue.pixelStorei(U.UNPACK_ALIGNMENT,F.unpackAlignment);const Jt=ue.getParameter(U.UNPACK_ROW_LENGTH),Ke=ue.getParameter(U.UNPACK_IMAGE_HEIGHT),rn=ue.getParameter(U.UNPACK_SKIP_PIXELS),Mn=ue.getParameter(U.UNPACK_SKIP_ROWS),Yn=ue.getParameter(U.UNPACK_SKIP_IMAGES);ue.pixelStorei(U.UNPACK_ROW_LENGTH,xt.width),ue.pixelStorei(U.UNPACK_IMAGE_HEIGHT,xt.height),ue.pixelStorei(U.UNPACK_SKIP_PIXELS,Te),ue.pixelStorei(U.UNPACK_SKIP_ROWS,ze),ue.pixelStorei(U.UNPACK_SKIP_IMAGES,Ve);const Li=M.isDataArrayTexture||M.isData3DTexture,ct=F.isDataArrayTexture||F.isData3DTexture;if(M.isDepthTexture){const yt=E.get(M),Kn=E.get(F),ht=E.get(yt.__renderTarget),Jn=E.get(Kn.__renderTarget);ue.bindFramebuffer(U.READ_FRAMEBUFFER,ht.__webglFramebuffer),ue.bindFramebuffer(U.DRAW_FRAMEBUFFER,Jn.__webglFramebuffer);for(let Ni=0;Ni<ye;Ni++)Li&&(U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,E.get(M).__webglTexture,G,Ve+Ni),U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,E.get(F).__webglTexture,fe,St+Ni)),U.blitFramebuffer(Te,ze,Me,de,Ae,rt,Me,de,U.DEPTH_BUFFER_BIT,U.NEAREST);ue.bindFramebuffer(U.READ_FRAMEBUFFER,null),ue.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else if(G!==0||M.isRenderTargetTexture||E.has(M)){const yt=E.get(M),Kn=E.get(F);ue.bindFramebuffer(U.READ_FRAMEBUFFER,rf),ue.bindFramebuffer(U.DRAW_FRAMEBUFFER,of);for(let ht=0;ht<ye;ht++)Li?U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,yt.__webglTexture,G,Ve+ht):U.framebufferTexture2D(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,yt.__webglTexture,G),ct?U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,Kn.__webglTexture,fe,St+ht):U.framebufferTexture2D(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,Kn.__webglTexture,fe),G!==0?U.blitFramebuffer(Te,ze,Me,de,Ae,rt,Me,de,U.COLOR_BUFFER_BIT,U.NEAREST):ct?U.copyTexSubImage3D(ge,fe,Ae,rt,St+ht,Te,ze,Me,de):U.copyTexSubImage2D(ge,fe,Ae,rt,Te,ze,Me,de);ue.bindFramebuffer(U.READ_FRAMEBUFFER,null),ue.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else ct?M.isDataTexture||M.isData3DTexture?U.texSubImage3D(ge,fe,Ae,rt,St,Me,de,ye,at,kt,xt.data):F.isCompressedArrayTexture?U.compressedTexSubImage3D(ge,fe,Ae,rt,St,Me,de,ye,at,xt.data):U.texSubImage3D(ge,fe,Ae,rt,St,Me,de,ye,at,kt,xt):M.isDataTexture?U.texSubImage2D(U.TEXTURE_2D,fe,Ae,rt,Me,de,at,kt,xt.data):M.isCompressedTexture?U.compressedTexSubImage2D(U.TEXTURE_2D,fe,Ae,rt,xt.width,xt.height,at,xt.data):U.texSubImage2D(U.TEXTURE_2D,fe,Ae,rt,Me,de,at,kt,xt);ue.pixelStorei(U.UNPACK_ROW_LENGTH,Jt),ue.pixelStorei(U.UNPACK_IMAGE_HEIGHT,Ke),ue.pixelStorei(U.UNPACK_SKIP_PIXELS,rn),ue.pixelStorei(U.UNPACK_SKIP_ROWS,Mn),ue.pixelStorei(U.UNPACK_SKIP_IMAGES,Yn),fe===0&&F.generateMipmaps&&U.generateMipmap(ge),ue.unbindTexture()},this.initRenderTarget=function(M){E.get(M).__webglFramebuffer===void 0&&_.setupRenderTarget(M)},this.initTexture=function(M){M.isCubeTexture?_.setTextureCube(M,0):M.isData3DTexture?_.setTexture3D(M,0):M.isDataArrayTexture||M.isCompressedArrayTexture?_.setTexture2DArray(M,0):_.setTexture2D(M,0),ue.unbindTexture()},this.resetState=function(){H=0,X=0,N=null,ue.reset(),se.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return An}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=Ze._getDrawingBufferColorSpace(e),t.unpackColorSpace=Ze._getUnpackColorSpace()}}const vE=75,xE=.1,ME=200,SE=4,yE=7;class bE{scene;camera;renderer;parent;updateFn=null;rafId=null;lastTime=0;resizeObserver;constructor(e){this.parent=e.parent,this.scene=new xv,this.scene.background=new Ne(11985151),this.scene.fog=new Uc(11985151,30,80),this.camera=new Zt(vE,1,xE,ME),this.camera.position.set(0,SE,yE),this.camera.lookAt(0,.2,-6),this.renderer=new _E({antialias:!0,powerPreference:"high-performance"}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.outputColorSpace=bt,this.parent.appendChild(this.renderer.domElement),this.renderer.domElement.style.width="100%",this.renderer.domElement.style.height="100%",this.renderer.domElement.style.touchAction="none";const t=new sx(16775400,7248839,.9);this.scene.add(t);const i=new Rd(16773844,.65);i.position.set(3,8,5),this.scene.add(i),this.resize(),this.resizeObserver=new ResizeObserver(()=>this.resize()),this.resizeObserver.observe(this.parent)}paused=!1;setUpdate(e){this.updateFn=e}setPaused(e){this.paused!==e&&(this.paused=e,e||(this.lastTime=performance.now()))}get isPaused(){return this.paused}start(){if(this.rafId!==null)return;this.lastTime=performance.now();const e=t=>{const i=Math.min((t-this.lastTime)/1e3,.03333333333333333);this.lastTime=t,this.updateFn&&!this.paused&&this.updateFn(i),this.renderer.render(this.scene,this.camera),this.rafId=requestAnimationFrame(e)};this.rafId=requestAnimationFrame(e)}stop(){this.rafId!==null&&(cancelAnimationFrame(this.rafId),this.rafId=null)}resize(){const e=this.parent.clientWidth,t=this.parent.clientHeight;e===0||t===0||(this.renderer.setSize(e,t,!1),this.camera.aspect=e/t,this.camera.updateProjectionMatrix())}dispose(){this.stop(),this.resizeObserver.disconnect(),this.renderer.dispose(),this.renderer.domElement.remove()}}const Hu=8;class EE{mesh;scene;texture;geometry;material;length;constructor(e){this.scene=e.scene,this.length=e.length;const t=new Ad;this.texture=t.load("/paris-study-game/textures/wood.svg"),this.texture.wrapS=li,this.texture.wrapT=li,this.texture.repeat.set(1,Hu),this.texture.colorSpace=bt,this.geometry=new Ys(e.width,e.length),this.material=new ot({map:this.texture,roughness:.85,metalness:0}),this.mesh=new Be(this.geometry,this.material),this.mesh.rotation.x=-Math.PI/2,this.mesh.position.set(0,0,-this.length/2+4),this.scene.add(this.mesh)}advance(e){this.texture.offset.y-=e/this.length*Hu}dispose(){this.scene.remove(this.mesh),this.geometry.dispose(),this.material.dispose(),this.texture.dispose()}}function Vu(n,e){if(e===C0)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),n;if(e===ic||e===ud){let t=n.getIndex();if(t===null){const o=[],a=n.getAttribute("position");if(a!==void 0){for(let c=0;c<a.count;c++)o.push(c);n.setIndex(o),t=n.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),n}const i=t.count-2,s=[];if(e===ic)for(let o=1;o<=i;o++)s.push(t.getX(0)),s.push(t.getX(o)),s.push(t.getX(o+1));else for(let o=0;o<i;o++)o%2===0?(s.push(t.getX(o)),s.push(t.getX(o+1)),s.push(t.getX(o+2))):(s.push(t.getX(o+2)),s.push(t.getX(o+1)),s.push(t.getX(o)));s.length/3!==i&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");const r=n.clone();return r.setIndex(s),r.clearGroups(),r}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),n}function TE(n){const e=new Map,t=new Map,i=n.clone();return zd(n,i,function(s,r){e.set(r,s),t.set(s,r)}),i.traverse(function(s){if(!s.isSkinnedMesh)return;const r=s,o=e.get(s),a=o.skeleton.bones;r.skeleton=o.skeleton.clone(),r.bindMatrix.copy(o.bindMatrix),r.skeleton.bones=a.map(function(c){return t.get(c)}),r.bind(r.skeleton,r.bindMatrix)}),i}function zd(n,e,t){t(n,e);for(let i=0;i<n.children.length;i++)zd(n.children[i],e.children[i],t)}class Bd extends Ss{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new PE(t)}),this.register(function(t){return new IE(t)}),this.register(function(t){return new kE(t)}),this.register(function(t){return new GE(t)}),this.register(function(t){return new HE(t)}),this.register(function(t){return new NE(t)}),this.register(function(t){return new DE(t)}),this.register(function(t){return new UE(t)}),this.register(function(t){return new OE(t)}),this.register(function(t){return new CE(t)}),this.register(function(t){return new FE(t)}),this.register(function(t){return new LE(t)}),this.register(function(t){return new BE(t)}),this.register(function(t){return new zE(t)}),this.register(function(t){return new wE(t)}),this.register(function(t){return new Wu(t,We.EXT_MESHOPT_COMPRESSION)}),this.register(function(t){return new Wu(t,We.KHR_MESHOPT_COMPRESSION)}),this.register(function(t){return new VE(t)})}load(e,t,i,s){const r=this;let o;if(this.resourcePath!=="")o=this.resourcePath;else if(this.path!==""){const l=Gs.extractUrlBase(e);o=Gs.resolveURL(l,this.path)}else o=Gs.extractUrlBase(e);this.manager.itemStart(e);const a=function(l){s?s(l):console.error(l),r.manager.itemError(e),r.manager.itemEnd(e)},c=new Td(this.manager);c.setPath(this.path),c.setResponseType("arraybuffer"),c.setRequestHeader(this.requestHeader),c.setWithCredentials(this.withCredentials),c.load(e,function(l){try{r.parse(l,o,function(u){t(u),r.manager.itemEnd(e)},a)}catch(u){a(u)}},i,a)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,i,s){let r;const o={},a={},c=new TextDecoder;if(typeof e=="string")r=JSON.parse(e);else if(e instanceof ArrayBuffer)if(c.decode(new Uint8Array(e,0,4))===kd){try{o[We.KHR_BINARY_GLTF]=new WE(e)}catch(d){s&&s(d);return}r=JSON.parse(o[We.KHR_BINARY_GLTF].content)}else r=JSON.parse(c.decode(e));else r=e;if(r.asset===void 0||r.asset.version[0]<2){s&&s(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}const l=new iT(r,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});l.fileLoader.setRequestHeader(this.requestHeader);for(let u=0;u<this.pluginCallbacks.length;u++){const d=this.pluginCallbacks[u](l);d.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),a[d.name]=d,o[d.name]=!0}if(r.extensionsUsed)for(let u=0;u<r.extensionsUsed.length;++u){const d=r.extensionsUsed[u],h=r.extensionsRequired||[];switch(d){case We.KHR_MATERIALS_UNLIT:o[d]=new RE;break;case We.KHR_DRACO_MESH_COMPRESSION:o[d]=new XE(r,this.dracoLoader);break;case We.KHR_TEXTURE_TRANSFORM:o[d]=new ZE;break;case We.KHR_MESH_QUANTIZATION:o[d]=new $E;break;default:h.indexOf(d)>=0&&a[d]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+d+'".')}}l.setExtensions(o),l.setPlugins(a),l.parse(i,s)}parseAsync(e,t){const i=this;return new Promise(function(s,r){i.parse(e,t,s,r)})}}function AE(){let n={};return{get:function(e){return n[e]},add:function(e,t){n[e]=t},remove:function(e){delete n[e]},removeAll:function(){n={}}}}function Et(n,e,t){const i=n.json.materials[e];return i.extensions&&i.extensions[t]?i.extensions[t]:null}const We={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",KHR_MESHOPT_COMPRESSION:"KHR_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"};class wE{constructor(e){this.parser=e,this.name=We.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){const e=this.parser,t=this.parser.json.nodes||[];for(let i=0,s=t.length;i<s;i++){const r=t[i];r.extensions&&r.extensions[this.name]&&r.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,r.extensions[this.name].light)}}_loadLight(e){const t=this.parser,i="light:"+e;let s=t.cache.get(i);if(s)return s;const r=t.json,c=((r.extensions&&r.extensions[this.name]||{}).lights||[])[e];let l;const u=new Ne(16777215);c.color!==void 0&&u.setRGB(c.color[0],c.color[1],c.color[2],sn);const d=c.range!==void 0?c.range:0;switch(c.type){case"directional":l=new Rd(u),l.target.position.set(0,0,-1),l.add(l.target);break;case"point":l=new cx(u),l.distance=d;break;case"spot":l=new ox(u),l.distance=d,c.spot=c.spot||{},c.spot.innerConeAngle=c.spot.innerConeAngle!==void 0?c.spot.innerConeAngle:0,c.spot.outerConeAngle=c.spot.outerConeAngle!==void 0?c.spot.outerConeAngle:Math.PI/4,l.angle=c.spot.outerConeAngle,l.penumbra=1-c.spot.innerConeAngle/c.spot.outerConeAngle,l.target.position.set(0,0,-1),l.add(l.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+c.type)}return l.position.set(0,0,0),bn(l,c),c.intensity!==void 0&&(l.intensity=c.intensity),l.name=t.createUniqueName(c.name||"light_"+e),s=Promise.resolve(l),t.cache.add(i,s),s}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){const t=this,i=this.parser,r=i.json.nodes[e],a=(r.extensions&&r.extensions[this.name]||{}).light;return a===void 0?null:this._loadLight(a).then(function(c){return i._getNodeRef(t.cache,a,c)})}}class RE{constructor(){this.name=We.KHR_MATERIALS_UNLIT}getMaterialType(){return ai}extendParams(e,t,i){const s=[];e.color=new Ne(1,1,1),e.opacity=1;const r=t.pbrMetallicRoughness;if(r){if(Array.isArray(r.baseColorFactor)){const o=r.baseColorFactor;e.color.setRGB(o[0],o[1],o[2],sn),e.opacity=o[3]}r.baseColorTexture!==void 0&&s.push(i.assignTexture(e,"map",r.baseColorTexture,bt))}return Promise.all(s)}}class CE{constructor(e){this.parser=e,this.name=We.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){const i=Et(this.parser,e,this.name);return i===null||i.emissiveStrength!==void 0&&(t.emissiveIntensity=i.emissiveStrength),Promise.resolve()}}class PE{constructor(e){this.parser=e,this.name=We.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){return Et(this.parser,e,this.name)!==null?Nn:null}extendMaterialParams(e,t){const i=Et(this.parser,e,this.name);if(i===null)return Promise.resolve();const s=[];if(i.clearcoatFactor!==void 0&&(t.clearcoat=i.clearcoatFactor),i.clearcoatTexture!==void 0&&s.push(this.parser.assignTexture(t,"clearcoatMap",i.clearcoatTexture)),i.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=i.clearcoatRoughnessFactor),i.clearcoatRoughnessTexture!==void 0&&s.push(this.parser.assignTexture(t,"clearcoatRoughnessMap",i.clearcoatRoughnessTexture)),i.clearcoatNormalTexture!==void 0&&(s.push(this.parser.assignTexture(t,"clearcoatNormalMap",i.clearcoatNormalTexture)),i.clearcoatNormalTexture.scale!==void 0)){const r=i.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new Ye(r,r)}return Promise.all(s)}}class IE{constructor(e){this.parser=e,this.name=We.KHR_MATERIALS_DISPERSION}getMaterialType(e){return Et(this.parser,e,this.name)!==null?Nn:null}extendMaterialParams(e,t){const i=Et(this.parser,e,this.name);return i===null||(t.dispersion=i.dispersion!==void 0?i.dispersion:0),Promise.resolve()}}class LE{constructor(e){this.parser=e,this.name=We.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){return Et(this.parser,e,this.name)!==null?Nn:null}extendMaterialParams(e,t){const i=Et(this.parser,e,this.name);if(i===null)return Promise.resolve();const s=[];return i.iridescenceFactor!==void 0&&(t.iridescence=i.iridescenceFactor),i.iridescenceTexture!==void 0&&s.push(this.parser.assignTexture(t,"iridescenceMap",i.iridescenceTexture)),i.iridescenceIor!==void 0&&(t.iridescenceIOR=i.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),i.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=i.iridescenceThicknessMinimum),i.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=i.iridescenceThicknessMaximum),i.iridescenceThicknessTexture!==void 0&&s.push(this.parser.assignTexture(t,"iridescenceThicknessMap",i.iridescenceThicknessTexture)),Promise.all(s)}}class NE{constructor(e){this.parser=e,this.name=We.KHR_MATERIALS_SHEEN}getMaterialType(e){return Et(this.parser,e,this.name)!==null?Nn:null}extendMaterialParams(e,t){const i=Et(this.parser,e,this.name);if(i===null)return Promise.resolve();const s=[];if(t.sheenColor=new Ne(0,0,0),t.sheenRoughness=0,t.sheen=1,i.sheenColorFactor!==void 0){const r=i.sheenColorFactor;t.sheenColor.setRGB(r[0],r[1],r[2],sn)}return i.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=i.sheenRoughnessFactor),i.sheenColorTexture!==void 0&&s.push(this.parser.assignTexture(t,"sheenColorMap",i.sheenColorTexture,bt)),i.sheenRoughnessTexture!==void 0&&s.push(this.parser.assignTexture(t,"sheenRoughnessMap",i.sheenRoughnessTexture)),Promise.all(s)}}class DE{constructor(e){this.parser=e,this.name=We.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){return Et(this.parser,e,this.name)!==null?Nn:null}extendMaterialParams(e,t){const i=Et(this.parser,e,this.name);if(i===null)return Promise.resolve();const s=[];return i.transmissionFactor!==void 0&&(t.transmission=i.transmissionFactor),i.transmissionTexture!==void 0&&s.push(this.parser.assignTexture(t,"transmissionMap",i.transmissionTexture)),Promise.all(s)}}class UE{constructor(e){this.parser=e,this.name=We.KHR_MATERIALS_VOLUME}getMaterialType(e){return Et(this.parser,e,this.name)!==null?Nn:null}extendMaterialParams(e,t){const i=Et(this.parser,e,this.name);if(i===null)return Promise.resolve();const s=[];t.thickness=i.thicknessFactor!==void 0?i.thicknessFactor:0,i.thicknessTexture!==void 0&&s.push(this.parser.assignTexture(t,"thicknessMap",i.thicknessTexture)),t.attenuationDistance=i.attenuationDistance||1/0;const r=i.attenuationColor||[1,1,1];return t.attenuationColor=new Ne().setRGB(r[0],r[1],r[2],sn),Promise.all(s)}}class OE{constructor(e){this.parser=e,this.name=We.KHR_MATERIALS_IOR}getMaterialType(e){return Et(this.parser,e,this.name)!==null?Nn:null}extendMaterialParams(e,t){const i=Et(this.parser,e,this.name);return i===null||(t.ior=i.ior!==void 0?i.ior:1.5,t.ior===0&&(t.ior=1e3)),Promise.resolve()}}class FE{constructor(e){this.parser=e,this.name=We.KHR_MATERIALS_SPECULAR}getMaterialType(e){return Et(this.parser,e,this.name)!==null?Nn:null}extendMaterialParams(e,t){const i=Et(this.parser,e,this.name);if(i===null)return Promise.resolve();const s=[];t.specularIntensity=i.specularFactor!==void 0?i.specularFactor:1,i.specularTexture!==void 0&&s.push(this.parser.assignTexture(t,"specularIntensityMap",i.specularTexture));const r=i.specularColorFactor||[1,1,1];return t.specularColor=new Ne().setRGB(r[0],r[1],r[2],sn),i.specularColorTexture!==void 0&&s.push(this.parser.assignTexture(t,"specularColorMap",i.specularColorTexture,bt)),Promise.all(s)}}class zE{constructor(e){this.parser=e,this.name=We.EXT_MATERIALS_BUMP}getMaterialType(e){return Et(this.parser,e,this.name)!==null?Nn:null}extendMaterialParams(e,t){const i=Et(this.parser,e,this.name);if(i===null)return Promise.resolve();const s=[];return t.bumpScale=i.bumpFactor!==void 0?i.bumpFactor:1,i.bumpTexture!==void 0&&s.push(this.parser.assignTexture(t,"bumpMap",i.bumpTexture)),Promise.all(s)}}class BE{constructor(e){this.parser=e,this.name=We.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){return Et(this.parser,e,this.name)!==null?Nn:null}extendMaterialParams(e,t){const i=Et(this.parser,e,this.name);if(i===null)return Promise.resolve();const s=[];return i.anisotropyStrength!==void 0&&(t.anisotropy=i.anisotropyStrength),i.anisotropyRotation!==void 0&&(t.anisotropyRotation=i.anisotropyRotation),i.anisotropyTexture!==void 0&&s.push(this.parser.assignTexture(t,"anisotropyMap",i.anisotropyTexture)),Promise.all(s)}}class kE{constructor(e){this.parser=e,this.name=We.KHR_TEXTURE_BASISU}loadTexture(e){const t=this.parser,i=t.json,s=i.textures[e];if(!s.extensions||!s.extensions[this.name])return null;const r=s.extensions[this.name],o=t.options.ktx2Loader;if(!o){if(i.extensionsRequired&&i.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,r.source,o)}}class GE{constructor(e){this.parser=e,this.name=We.EXT_TEXTURE_WEBP}loadTexture(e){const t=this.name,i=this.parser,s=i.json,r=s.textures[e];if(!r.extensions||!r.extensions[t])return null;const o=r.extensions[t],a=s.images[o.source];let c=i.textureLoader;if(a.uri){const l=i.options.manager.getHandler(a.uri);l!==null&&(c=l)}return i.loadTextureImage(e,o.source,c)}}class HE{constructor(e){this.parser=e,this.name=We.EXT_TEXTURE_AVIF}loadTexture(e){const t=this.name,i=this.parser,s=i.json,r=s.textures[e];if(!r.extensions||!r.extensions[t])return null;const o=r.extensions[t],a=s.images[o.source];let c=i.textureLoader;if(a.uri){const l=i.options.manager.getHandler(a.uri);l!==null&&(c=l)}return i.loadTextureImage(e,o.source,c)}}class Wu{constructor(e,t){this.name=t,this.parser=e}loadBufferView(e){const t=this.parser.json,i=t.bufferViews[e];if(i.extensions&&i.extensions[this.name]){const s=i.extensions[this.name],r=this.parser.getDependency("buffer",s.buffer),o=this.parser.options.meshoptDecoder;if(!o||!o.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return r.then(function(a){const c=s.byteOffset||0,l=s.byteLength||0,u=s.count,d=s.byteStride,h=new Uint8Array(a,c,l);return o.decodeGltfBufferAsync?o.decodeGltfBufferAsync(u,d,h,s.mode,s.filter).then(function(f){return f.buffer}):o.ready.then(function(){const f=new ArrayBuffer(u*d);return o.decodeGltfBuffer(new Uint8Array(f),u,d,h,s.mode,s.filter),f})})}else return null}}class VE{constructor(e){this.name=We.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){const t=this.parser.json,i=t.nodes[e];if(!i.extensions||!i.extensions[this.name]||i.mesh===void 0)return null;const s=t.meshes[i.mesh];for(const l of s.primitives)if(l.mode!==an.TRIANGLES&&l.mode!==an.TRIANGLE_STRIP&&l.mode!==an.TRIANGLE_FAN&&l.mode!==void 0)return null;const o=i.extensions[this.name].attributes,a=[],c={};for(const l in o)a.push(this.parser.getDependency("accessor",o[l]).then(u=>(c[l]=u,c[l])));return a.length<1?null:(a.push(this.parser.createNodeMesh(e)),Promise.all(a).then(l=>{const u=l.pop(),d=u.isGroup?u.children:[u],h=l[0].count,f=[];for(const g of d){const x=new He,m=new z,p=new qn,S=new z(1,1,1),b=new Pv(g.geometry,g.material,h);for(let y=0;y<h;y++)c.TRANSLATION&&m.fromBufferAttribute(c.TRANSLATION,y),c.ROTATION&&p.fromBufferAttribute(c.ROTATION,y),c.SCALE&&S.fromBufferAttribute(c.SCALE,y),b.setMatrixAt(y,x.compose(m,p,S));for(const y in c)if(y==="_COLOR_0"){const w=c[y];b.instanceColor=new ac(w.array,w.itemSize,w.normalized)}else y!=="TRANSLATION"&&y!=="ROTATION"&&y!=="SCALE"&&g.geometry.setAttribute(y,c[y]);ft.prototype.copy.call(b,g),this.parser.assignFinalMaterial(b),f.push(b)}return u.isGroup?(u.clear(),u.add(...f),u):f[0]}))}}const kd="glTF",Ns=12,Xu={JSON:1313821514,BIN:5130562};class WE{constructor(e){this.name=We.KHR_BINARY_GLTF,this.content=null,this.body=null;const t=new DataView(e,0,Ns),i=new TextDecoder;if(this.header={magic:i.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==kd)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");const s=this.header.length-Ns,r=new DataView(e,Ns);let o=0;for(;o<s;){const a=r.getUint32(o,!0);o+=4;const c=r.getUint32(o,!0);if(o+=4,c===Xu.JSON){const l=new Uint8Array(e,Ns+o,a);this.content=i.decode(l)}else if(c===Xu.BIN){const l=Ns+o;this.body=e.slice(l,l+a)}o+=a}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}}class XE{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=We.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){const i=this.json,s=this.dracoLoader,r=e.extensions[this.name].bufferView,o=e.extensions[this.name].attributes,a={},c={},l={};for(const u in o){const d=hc[u]||u.toLowerCase();a[d]=o[u]}for(const u in e.attributes){const d=hc[u]||u.toLowerCase();if(o[u]!==void 0){const h=i.accessors[e.attributes[u]],f=as[h.componentType];l[d]=f.name,c[d]=h.normalized===!0}}return t.getDependency("bufferView",r).then(function(u){return new Promise(function(d,h){s.decodeDracoFile(u,function(f){for(const g in f.attributes){const x=f.attributes[g],m=c[g];m!==void 0&&(x.normalized=m)}d(f)},a,l,sn,h)})})}}class ZE{constructor(){this.name=We.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){return(t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0||(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),e.needsUpdate=!0),e}}class $E{constructor(){this.name=We.KHR_MESH_QUANTIZATION}}class Gd extends vs{constructor(e,t,i,s){super(e,t,i,s)}copySampleValue_(e){const t=this.resultBuffer,i=this.sampleValues,s=this.valueSize,r=e*s*3+s;for(let o=0;o!==s;o++)t[o]=i[r+o];return t}interpolate_(e,t,i,s){const r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=a*2,l=a*3,u=s-t,d=(i-t)/u,h=d*d,f=h*d,g=e*l,x=g-l,m=-2*f+3*h,p=f-h,S=1-m,b=p-h+d;for(let y=0;y!==a;y++){const w=o[x+y+a],T=o[x+y+c]*u,C=o[g+y+a],v=o[g+y]*u;r[y]=S*w+b*T+m*C+p*v}return r}}const qE=new qn;class jE extends Gd{interpolate_(e,t,i,s){const r=super.interpolate_(e,t,i,s);return qE.fromArray(r).normalize().toArray(r),r}}const an={POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6},as={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},Zu={9728:It,9729:Lt,9984:id,9985:Nr,9986:Fs,9987:Gn},$u={33071:Tn,33648:Wr,10497:li},ta={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},hc={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},ri={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},YE={CUBICSPLINE:void 0,LINEAR:$s,STEP:Zs},na={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function KE(n){return n.DefaultMaterial===void 0&&(n.DefaultMaterial=new ot({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:Xn})),n.DefaultMaterial}function vi(n,e,t){for(const i in t.extensions)n[i]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[i]=t.extensions[i])}function bn(n,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(n.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function JE(n,e,t){let i=!1,s=!1,r=!1;for(let l=0,u=e.length;l<u;l++){const d=e[l];if(d.POSITION!==void 0&&(i=!0),d.NORMAL!==void 0&&(s=!0),d.COLOR_0!==void 0&&(r=!0),i&&s&&r)break}if(!i&&!s&&!r)return Promise.resolve(n);const o=[],a=[],c=[];for(let l=0,u=e.length;l<u;l++){const d=e[l];if(i){const h=d.POSITION!==void 0?t.getDependency("accessor",d.POSITION):n.attributes.position;o.push(h)}if(s){const h=d.NORMAL!==void 0?t.getDependency("accessor",d.NORMAL):n.attributes.normal;a.push(h)}if(r){const h=d.COLOR_0!==void 0?t.getDependency("accessor",d.COLOR_0):n.attributes.color;c.push(h)}}return Promise.all([Promise.all(o),Promise.all(a),Promise.all(c)]).then(function(l){const u=l[0],d=l[1],h=l[2];return i&&(n.morphAttributes.position=u),s&&(n.morphAttributes.normal=d),r&&(n.morphAttributes.color=h),n.morphTargetsRelative=!0,n})}function QE(n,e){if(n.updateMorphTargets(),e.weights!==void 0)for(let t=0,i=e.weights.length;t<i;t++)n.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){const t=e.extras.targetNames;if(n.morphTargetInfluences.length===t.length){n.morphTargetDictionary={};for(let i=0,s=t.length;i<s;i++)n.morphTargetDictionary[t[i]]=i}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function eT(n){let e;const t=n.extensions&&n.extensions[We.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+ia(t.attributes):e=n.indices+":"+ia(n.attributes)+":"+n.mode,n.targets!==void 0)for(let i=0,s=n.targets.length;i<s;i++)e+=":"+ia(n.targets[i]);return e}function ia(n){let e="";const t=Object.keys(n).sort();for(let i=0,s=t.length;i<s;i++)e+=t[i]+":"+n[t[i]]+";";return e}function dc(n){switch(n){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function tT(n){return n.search(/\.jpe?g($|\?)/i)>0||n.search(/^data\:image\/jpeg/)===0?"image/jpeg":n.search(/\.webp($|\?)/i)>0||n.search(/^data\:image\/webp/)===0?"image/webp":n.search(/\.ktx2($|\?)/i)>0||n.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}const nT=new He;class iT{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new AE,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let i=!1,s=-1,r=!1,o=-1;if(typeof navigator<"u"&&typeof navigator.userAgent<"u"){const a=navigator.userAgent;i=/^((?!chrome|android).)*safari/i.test(a)===!0;const c=a.match(/Version\/(\d+)/);s=i&&c?parseInt(c[1],10):-1,r=a.indexOf("Firefox")>-1,o=r?a.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||i&&s<17||r&&o<98?this.textureLoader=new Ad(this.options.manager):this.textureLoader=new ux(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new Td(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){const i=this,s=this.json,r=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(o){return o._markDefs&&o._markDefs()}),Promise.all(this._invokeAll(function(o){return o.beforeRoot&&o.beforeRoot()})).then(function(){return Promise.all([i.getDependencies("scene"),i.getDependencies("animation"),i.getDependencies("camera")])}).then(function(o){const a={scene:o[0][s.scene||0],scenes:o[0],animations:o[1],cameras:o[2],asset:s.asset,parser:i,userData:{}};return vi(r,a,s),bn(a,s),Promise.all(i._invokeAll(function(c){return c.afterRoot&&c.afterRoot(a)})).then(function(){for(const c of a.scenes)c.updateMatrixWorld();e(a)})}).catch(t)}_markDefs(){const e=this.json.nodes||[],t=this.json.skins||[],i=this.json.meshes||[];for(let s=0,r=t.length;s<r;s++){const o=t[s].joints;for(let a=0,c=o.length;a<c;a++)e[o[a]].isBone=!0}for(let s=0,r=e.length;s<r;s++){const o=e[s];o.mesh!==void 0&&(this._addNodeRef(this.meshCache,o.mesh),o.skin!==void 0&&(i[o.mesh].isSkinnedMesh=!0)),o.camera!==void 0&&this._addNodeRef(this.cameraCache,o.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,i){if(e.refs[t]<=1)return i;const s=i.clone(),r=(o,a)=>{const c=this.associations.get(o);c!=null&&this.associations.set(a,c);for(const[l,u]of o.children.entries())r(u,a.children[l])};return r(i,s),s.name+="_instance_"+e.uses[t]++,s}_invokeOne(e){const t=Object.values(this.plugins);t.push(this);for(let i=0;i<t.length;i++){const s=e(t[i]);if(s)return s}return null}_invokeAll(e){const t=Object.values(this.plugins);t.unshift(this);const i=[];for(let s=0;s<t.length;s++){const r=e(t[s]);r&&i.push(r)}return i}getDependency(e,t){const i=e+":"+t;let s=this.cache.get(i);if(!s){switch(e){case"scene":s=this.loadScene(t);break;case"node":s=this._invokeOne(function(r){return r.loadNode&&r.loadNode(t)});break;case"mesh":s=this._invokeOne(function(r){return r.loadMesh&&r.loadMesh(t)});break;case"accessor":s=this.loadAccessor(t);break;case"bufferView":s=this._invokeOne(function(r){return r.loadBufferView&&r.loadBufferView(t)});break;case"buffer":s=this.loadBuffer(t);break;case"material":s=this._invokeOne(function(r){return r.loadMaterial&&r.loadMaterial(t)});break;case"texture":s=this._invokeOne(function(r){return r.loadTexture&&r.loadTexture(t)});break;case"skin":s=this.loadSkin(t);break;case"animation":s=this._invokeOne(function(r){return r.loadAnimation&&r.loadAnimation(t)});break;case"camera":s=this.loadCamera(t);break;default:if(s=this._invokeOne(function(r){return r!=this&&r.getDependency&&r.getDependency(e,t)}),!s)throw new Error("Unknown type: "+e);break}this.cache.add(i,s)}return s}getDependencies(e){let t=this.cache.get(e);if(!t){const i=this,s=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(s.map(function(r,o){return i.getDependency(e,o)})),this.cache.add(e,t)}return t}loadBuffer(e){const t=this.json.buffers[e],i=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[We.KHR_BINARY_GLTF].body);const s=this.options;return new Promise(function(r,o){i.load(Gs.resolveURL(t.uri,s.path),r,void 0,function(){o(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){const t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(i){const s=t.byteLength||0,r=t.byteOffset||0;return i.slice(r,r+s)})}loadAccessor(e){const t=this,i=this.json,s=this.json.accessors[e];if(s.bufferView===void 0&&s.sparse===void 0){const o=ta[s.type],a=as[s.componentType],c=s.normalized===!0,l=new a(s.count*o);return Promise.resolve(new $t(l,o,c))}const r=[];return s.bufferView!==void 0?r.push(this.getDependency("bufferView",s.bufferView)):r.push(null),s.sparse!==void 0&&(r.push(this.getDependency("bufferView",s.sparse.indices.bufferView)),r.push(this.getDependency("bufferView",s.sparse.values.bufferView))),Promise.all(r).then(function(o){const a=o[0],c=ta[s.type],l=as[s.componentType],u=l.BYTES_PER_ELEMENT,d=u*c,h=s.byteOffset||0,f=s.bufferView!==void 0?i.bufferViews[s.bufferView].byteStride:void 0,g=s.normalized===!0;let x,m;if(f&&f!==d){const p=Math.floor(h/f),S="InterleavedBuffer:"+s.bufferView+":"+s.componentType+":"+p+":"+s.count;let b=t.cache.get(S);b||(x=new l(a,p*f,s.count*f/u),b=new bv(x,f/u),t.cache.add(S,b)),m=new Oc(b,c,h%f/u,g)}else a===null?x=new l(s.count*c):x=new l(a,h,s.count*c),m=new $t(x,c,g);if(s.sparse!==void 0){const p=ta.SCALAR,S=as[s.sparse.indices.componentType],b=s.sparse.indices.byteOffset||0,y=s.sparse.values.byteOffset||0,w=new S(o[1],b,s.sparse.count*p),T=new l(o[2],y,s.sparse.count*c);a!==null&&(m=new $t(m.array.slice(),m.itemSize,m.normalized)),m.normalized=!1;for(let C=0,v=w.length;C<v;C++){const A=w[C];if(m.setX(A,T[C*c]),c>=2&&m.setY(A,T[C*c+1]),c>=3&&m.setZ(A,T[C*c+2]),c>=4&&m.setW(A,T[C*c+3]),c>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}m.normalized=g}return m})}loadTexture(e){const t=this.json,i=this.options,r=t.textures[e].source,o=t.images[r];let a=this.textureLoader;if(o.uri){const c=i.manager.getHandler(o.uri);c!==null&&(a=c)}return this.loadTextureImage(e,r,a)}loadTextureImage(e,t,i){const s=this,r=this.json,o=r.textures[e],a=r.images[t],c=(a.uri||a.bufferView)+":"+o.sampler;if(this.textureCache[c])return this.textureCache[c];const l=this.loadImageSource(t,i).then(function(u){u.flipY=!1,u.name=o.name||a.name||"",u.name===""&&typeof a.uri=="string"&&a.uri.startsWith("data:image/")===!1&&(u.name=a.uri);const h=(r.samplers||{})[o.sampler]||{};return u.magFilter=Zu[h.magFilter]||Lt,u.minFilter=Zu[h.minFilter]||Gn,u.wrapS=$u[h.wrapS]||li,u.wrapT=$u[h.wrapT]||li,u.generateMipmaps=!u.isCompressedTexture&&u.minFilter!==It&&u.minFilter!==Lt,s.associations.set(u,{textures:e}),u}).catch(function(){return null});return this.textureCache[c]=l,l}loadImageSource(e,t){const i=this,s=this.json,r=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(d=>d.clone());const o=s.images[e],a=self.URL||self.webkitURL;let c=o.uri||"",l=!1;if(o.bufferView!==void 0)c=i.getDependency("bufferView",o.bufferView).then(function(d){l=!0;const h=new Blob([d],{type:o.mimeType});return c=a.createObjectURL(h),c});else if(o.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");const u=Promise.resolve(c).then(function(d){return new Promise(function(h,f){let g=h;t.isImageBitmapLoader===!0&&(g=function(x){const m=new Nt(x);m.needsUpdate=!0,h(m)}),t.load(Gs.resolveURL(d,r.path),g,void 0,f)})}).then(function(d){return l===!0&&a.revokeObjectURL(c),bn(d,o),d.userData.mimeType=o.mimeType||tT(o.uri),d}).catch(function(d){throw console.error("THREE.GLTFLoader: Couldn't load texture",c),d});return this.sourceCache[e]=u,u}assignTexture(e,t,i,s){const r=this;return this.getDependency("texture",i.index).then(function(o){if(!o)return null;if(i.texCoord!==void 0&&i.texCoord>0&&(o=o.clone(),o.channel=i.texCoord),r.extensions[We.KHR_TEXTURE_TRANSFORM]){const a=i.extensions!==void 0?i.extensions[We.KHR_TEXTURE_TRANSFORM]:void 0;if(a){const c=r.associations.get(o);o=r.extensions[We.KHR_TEXTURE_TRANSFORM].extendTexture(o,a),r.associations.set(o,c)}}return s!==void 0&&(o.colorSpace=s),e[t]=o,o})}assignFinalMaterial(e){const t=e.geometry;let i=e.material;const s=t.attributes.tangent===void 0,r=t.attributes.color!==void 0,o=t.attributes.normal===void 0;if(e.isPoints){const a="PointsMaterial:"+i.uuid;let c=this.cache.get(a);c||(c=new xd,Cn.prototype.copy.call(c,i),c.color.copy(i.color),c.map=i.map,c.sizeAttenuation=!1,this.cache.add(a,c)),i=c}else if(e.isLine){const a="LineBasicMaterial:"+i.uuid;let c=this.cache.get(a);c||(c=new vd,Cn.prototype.copy.call(c,i),c.color.copy(i.color),c.map=i.map,this.cache.add(a,c)),i=c}if(s||r||o){let a="ClonedMaterial:"+i.uuid+":";s&&(a+="derivative-tangents:"),r&&(a+="vertex-colors:"),o&&(a+="flat-shading:");let c=this.cache.get(a);c||(c=i.clone(),r&&(c.vertexColors=!0),o&&(c.flatShading=!0),s&&(c.normalScale&&(c.normalScale.y*=-1),c.clearcoatNormalScale&&(c.clearcoatNormalScale.y*=-1)),this.cache.add(a,c),this.associations.set(c,this.associations.get(i))),i=c}e.material=i}getMaterialType(){return ot}loadMaterial(e){const t=this,i=this.json,s=this.extensions,r=i.materials[e];let o;const a={},c=r.extensions||{},l=[];if(c[We.KHR_MATERIALS_UNLIT]){const d=s[We.KHR_MATERIALS_UNLIT];o=d.getMaterialType(),l.push(d.extendParams(a,r,t))}else{const d=r.pbrMetallicRoughness||{};if(a.color=new Ne(1,1,1),a.opacity=1,Array.isArray(d.baseColorFactor)){const h=d.baseColorFactor;a.color.setRGB(h[0],h[1],h[2],sn),a.opacity=h[3]}d.baseColorTexture!==void 0&&l.push(t.assignTexture(a,"map",d.baseColorTexture,bt)),a.metalness=d.metallicFactor!==void 0?d.metallicFactor:1,a.roughness=d.roughnessFactor!==void 0?d.roughnessFactor:1,d.metallicRoughnessTexture!==void 0&&(l.push(t.assignTexture(a,"metalnessMap",d.metallicRoughnessTexture)),l.push(t.assignTexture(a,"roughnessMap",d.metallicRoughnessTexture))),o=this._invokeOne(function(h){return h.getMaterialType&&h.getMaterialType(e)}),l.push(Promise.all(this._invokeAll(function(h){return h.extendMaterialParams&&h.extendMaterialParams(e,a)})))}r.doubleSided===!0&&(a.side=Ft);const u=r.alphaMode||na.OPAQUE;if(u===na.BLEND?(a.transparent=!0,a.depthWrite=!1):(a.transparent=!1,u===na.MASK&&(a.alphaTest=r.alphaCutoff!==void 0?r.alphaCutoff:.5)),r.normalTexture!==void 0&&o!==ai&&(l.push(t.assignTexture(a,"normalMap",r.normalTexture)),a.normalScale=new Ye(1,1),r.normalTexture.scale!==void 0)){const d=r.normalTexture.scale;a.normalScale.set(d,d)}if(r.occlusionTexture!==void 0&&o!==ai&&(l.push(t.assignTexture(a,"aoMap",r.occlusionTexture)),r.occlusionTexture.strength!==void 0&&(a.aoMapIntensity=r.occlusionTexture.strength)),r.emissiveFactor!==void 0&&o!==ai){const d=r.emissiveFactor;a.emissive=new Ne().setRGB(d[0],d[1],d[2],sn)}return r.emissiveTexture!==void 0&&o!==ai&&l.push(t.assignTexture(a,"emissiveMap",r.emissiveTexture,bt)),Promise.all(l).then(function(){const d=new o(a);return r.name&&(d.name=r.name),bn(d,r),t.associations.set(d,{materials:e}),r.extensions&&vi(s,d,r),d})}createUniqueName(e){const t=tt.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){const t=this,i=this.extensions,s=this.primitiveCache;function r(a){return i[We.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(a,t).then(function(c){return qu(c,a,t)})}const o=[];for(let a=0,c=e.length;a<c;a++){const l=e[a],u=eT(l),d=s[u];if(d)o.push(d.promise);else{let h;l.extensions&&l.extensions[We.KHR_DRACO_MESH_COMPRESSION]?h=r(l):h=qu(new qt,l,t),s[u]={primitive:l,promise:h},o.push(h)}}return Promise.all(o)}loadMesh(e){const t=this,i=this.json,s=this.extensions,r=i.meshes[e],o=r.primitives,a=[];for(let c=0,l=o.length;c<l;c++){const u=o[c].material===void 0?KE(this.cache):this.getDependency("material",o[c].material);a.push(u)}return a.push(t.loadGeometries(o)),Promise.all(a).then(function(c){const l=c.slice(0,c.length-1),u=c[c.length-1],d=[];for(let f=0,g=u.length;f<g;f++){const x=u[f],m=o[f];let p;const S=l[f];if(m.mode===an.TRIANGLES||m.mode===an.TRIANGLE_STRIP||m.mode===an.TRIANGLE_FAN||m.mode===void 0)p=r.isSkinnedMesh===!0?new wv(x,S):new Be(x,S),p.isSkinnedMesh===!0&&p.normalizeSkinWeights(),m.mode===an.TRIANGLE_STRIP?p.geometry=Vu(p.geometry,ud):m.mode===an.TRIANGLE_FAN&&(p.geometry=Vu(p.geometry,ic));else if(m.mode===an.LINES)p=new Dv(x,S);else if(m.mode===an.LINE_STRIP)p=new kc(x,S);else if(m.mode===an.LINE_LOOP)p=new Uv(x,S);else if(m.mode===an.POINTS)p=new Ov(x,S);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+m.mode);Object.keys(p.geometry.morphAttributes).length>0&&QE(p,r),p.name=t.createUniqueName(r.name||"mesh_"+e),bn(p,r),m.extensions&&vi(s,p,m),t.assignFinalMaterial(p),d.push(p)}for(let f=0,g=d.length;f<g;f++)t.associations.set(d[f],{meshes:e,primitives:f});if(d.length===1)return r.extensions&&vi(s,d[0],r),d[0];const h=new nn;r.extensions&&vi(s,h,r),t.associations.set(h,{meshes:e});for(let f=0,g=d.length;f<g;f++)h.add(d[f]);return h})}loadCamera(e){let t;const i=this.json.cameras[e],s=i[i.type];if(!s){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return i.type==="perspective"?t=new Zt(rv.radToDeg(s.yfov),s.aspectRatio||1,s.znear||1,s.zfar||2e6):i.type==="orthographic"&&(t=new ao(-s.xmag,s.xmag,s.ymag,-s.ymag,s.znear,s.zfar)),i.name&&(t.name=this.createUniqueName(i.name)),bn(t,i),Promise.resolve(t)}loadSkin(e){const t=this.json.skins[e],i=[];for(let s=0,r=t.joints.length;s<r;s++)i.push(this._loadNodeShallow(t.joints[s]));return t.inverseBindMatrices!==void 0?i.push(this.getDependency("accessor",t.inverseBindMatrices)):i.push(null),Promise.all(i).then(function(s){const r=s.pop(),o=s,a=[],c=[];for(let l=0,u=o.length;l<u;l++){const d=o[l];if(d){a.push(d);const h=new He;r!==null&&h.fromArray(r.array,l*16),c.push(h)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[l])}return new zc(a,c)})}loadAnimation(e){const t=this.json,i=this,s=t.animations[e],r=s.name?s.name:"animation_"+e,o=[],a=[],c=[],l=[],u=[];for(let d=0,h=s.channels.length;d<h;d++){const f=s.channels[d],g=s.samplers[f.sampler],x=f.target,m=x.node,p=s.parameters!==void 0?s.parameters[g.input]:g.input,S=s.parameters!==void 0?s.parameters[g.output]:g.output;x.node!==void 0&&(o.push(this.getDependency("node",m)),a.push(this.getDependency("accessor",p)),c.push(this.getDependency("accessor",S)),l.push(g),u.push(x))}return Promise.all([Promise.all(o),Promise.all(a),Promise.all(c),Promise.all(l),Promise.all(u)]).then(function(d){const h=d[0],f=d[1],g=d[2],x=d[3],m=d[4],p=[];for(let b=0,y=h.length;b<y;b++){const w=h[b],T=f[b],C=g[b],v=x[b],A=m[b];if(w===void 0)continue;w.updateMatrix&&w.updateMatrix();const L=i._createAnimationTracks(w,T,C,v,A);if(L)for(let R=0;R<L.length;R++)p.push(L[R])}const S=new Kv(r,void 0,p);return bn(S,s),S})}createNodeMesh(e){const t=this.json,i=this,s=t.nodes[e];return s.mesh===void 0?null:i.getDependency("mesh",s.mesh).then(function(r){const o=i._getNodeRef(i.meshCache,s.mesh,r);return s.weights!==void 0&&o.traverse(function(a){if(a.isMesh)for(let c=0,l=s.weights.length;c<l;c++)a.morphTargetInfluences[c]=s.weights[c]}),o})}loadNode(e){const t=this.json,i=this,s=t.nodes[e],r=i._loadNodeShallow(e),o=[],a=s.children||[];for(let l=0,u=a.length;l<u;l++)o.push(i.getDependency("node",a[l]));const c=s.skin===void 0?Promise.resolve(null):i.getDependency("skin",s.skin);return Promise.all([r,Promise.all(o),c]).then(function(l){const u=l[0],d=l[1],h=l[2];h!==null&&u.traverse(function(f){f.isSkinnedMesh&&f.bind(h,nT)});for(let f=0,g=d.length;f<g;f++)u.add(d[f]);if(u.userData.pivot!==void 0&&d.length>0){const f=u.userData.pivot,g=d[0];u.pivot=new z().fromArray(f),u.position.x-=f[0],u.position.y-=f[1],u.position.z-=f[2],g.position.set(0,0,0),delete u.userData.pivot}return u})}_loadNodeShallow(e){const t=this.json,i=this.extensions,s=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];const r=t.nodes[e],o=r.name?s.createUniqueName(r.name):"",a=[],c=s._invokeOne(function(l){return l.createNodeMesh&&l.createNodeMesh(e)});return c&&a.push(c),r.camera!==void 0&&a.push(s.getDependency("camera",r.camera).then(function(l){return s._getNodeRef(s.cameraCache,r.camera,l)})),s._invokeAll(function(l){return l.createNodeAttachment&&l.createNodeAttachment(e)}).forEach(function(l){a.push(l)}),this.nodeCache[e]=Promise.all(a).then(function(l){let u;if(r.isBone===!0?u=new _d:l.length>1?u=new nn:l.length===1?u=l[0]:u=new ft,u!==l[0])for(let d=0,h=l.length;d<h;d++)u.add(l[d]);if(r.name&&(u.userData.name=r.name,u.name=o),bn(u,r),r.extensions&&vi(i,u,r),r.matrix!==void 0){const d=new He;d.fromArray(r.matrix),u.applyMatrix4(d)}else r.translation!==void 0&&u.position.fromArray(r.translation),r.rotation!==void 0&&u.quaternion.fromArray(r.rotation),r.scale!==void 0&&u.scale.fromArray(r.scale);if(!s.associations.has(u))s.associations.set(u,{});else if(r.mesh!==void 0&&s.meshCache.refs[r.mesh]>1){const d=s.associations.get(u);s.associations.set(u,{...d})}return s.associations.get(u).nodes=e,u}),this.nodeCache[e]}loadScene(e){const t=this.extensions,i=this.json.scenes[e],s=this,r=new nn;i.name&&(r.name=s.createUniqueName(i.name)),bn(r,i),i.extensions&&vi(t,r,i);const o=i.nodes||[],a=[];for(let c=0,l=o.length;c<l;c++)a.push(s.getDependency("node",o[c]));return Promise.all(a).then(function(c){for(let u=0,d=c.length;u<d;u++){const h=c[u];h.parent!==null?r.add(TE(h)):r.add(h)}const l=u=>{const d=new Map;for(const[h,f]of s.associations)(h instanceof Cn||h instanceof Nt)&&d.set(h,f);return u.traverse(h=>{const f=s.associations.get(h);f!=null&&d.set(h,f)}),d};return s.associations=l(r),r})}_createAnimationTracks(e,t,i,s,r){const o=[],a=e.name?e.name:e.uuid,c=[];function l(f){f.morphTargetInfluences&&c.push(f.name?f.name:f.uuid)}ri[r.path]===ri.weights?(l(e),e.isGroup&&e.children.forEach(l)):c.push(a);let u;switch(ri[r.path]){case ri.weights:u=ps;break;case ri.rotation:u=ms;break;case ri.translation:case ri.scale:u=gs;break;default:switch(i.itemSize){case 1:u=ps;break;case 2:case 3:default:u=gs;break}break}const d=s.interpolation!==void 0?YE[s.interpolation]:$s,h=this._getArrayFromAccessor(i);for(let f=0,g=c.length;f<g;f++){const x=new u(c[f]+"."+ri[r.path],t.array,h,d);s.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(x),o.push(x)}return o}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){const i=dc(t.constructor),s=new Float32Array(t.length);for(let r=0,o=t.length;r<o;r++)s[r]=t[r]*i;t=s}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(i){const s=this instanceof ms?jE:Gd;return new s(this.times,this.values,this.getValueSize()/3,i)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}}function sT(n,e,t){const i=e.attributes,s=new jn;if(i.POSITION!==void 0){const a=t.json.accessors[i.POSITION],c=a.min,l=a.max;if(c!==void 0&&l!==void 0){if(s.set(new z(c[0],c[1],c[2]),new z(l[0],l[1],l[2])),a.normalized){const u=dc(as[a.componentType]);s.min.multiplyScalar(u),s.max.multiplyScalar(u)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;const r=e.targets;if(r!==void 0){const a=new z,c=new z;for(let l=0,u=r.length;l<u;l++){const d=r[l];if(d.POSITION!==void 0){const h=t.json.accessors[d.POSITION],f=h.min,g=h.max;if(f!==void 0&&g!==void 0){if(c.setX(Math.max(Math.abs(f[0]),Math.abs(g[0]))),c.setY(Math.max(Math.abs(f[1]),Math.abs(g[1]))),c.setZ(Math.max(Math.abs(f[2]),Math.abs(g[2]))),h.normalized){const x=dc(as[h.componentType]);c.multiplyScalar(x)}a.max(c)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}s.expandByVector(a)}n.boundingBox=s;const o=new Ln;s.getCenter(o.center),o.radius=s.min.distanceTo(s.max)/2,n.boundingSphere=o}function qu(n,e,t){const i=e.attributes,s=[];function r(o,a){return t.getDependency("accessor",o).then(function(c){n.setAttribute(a,c)})}for(const o in i){const a=hc[o]||o.toLowerCase();a in n.attributes||s.push(r(i[o],a))}if(e.indices!==void 0&&!n.index){const o=t.getDependency("accessor",e.indices).then(function(a){n.setIndex(a)});s.push(o)}return Ze.workingColorSpace!==sn&&"COLOR_0"in i&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${Ze.workingColorSpace}" not supported.`),bn(n,e),sT(n,e,t),Promise.all(s).then(function(){return e.targets!==void 0?JE(n,e.targets,t):n})}const Jr=.22,Hd=.75,ju=Hd/2,yi=2,rT=16743096,oT=.6,aT=.05,cT="/paris-study-game/models/hand.glb",lT=Jr,uT=Jr,hT=.18;class dT{group;scene;cup;cupGeometry;cupMaterial;shadowGeometry;shadowMaterial;handRoot=null;handMaterial=null;_x=0;targetX=0;smoothing;constructor(e){this.scene=e.scene,this.smoothing=e.smoothing??hT,this.group=new nn,this.cupGeometry=new Ii(Jr,0,Hd,16,1,!0),this.cupMaterial=new ot({color:16743096,emissive:4463152,roughness:.3,metalness:0,side:Ft}),this.cup=new Be(this.cupGeometry,this.cupMaterial),this.cup.position.set(0,ju,yi),this.group.add(this.cup),this.shadowGeometry=new ro(Jr*1.4,32),this.shadowMaterial=new ai({color:0,transparent:!0,opacity:.35,depthWrite:!1});const t=new Be(this.shadowGeometry,this.shadowMaterial);t.rotation.x=-Math.PI/2,t.position.set(0,.01,yi),this.group.add(t),this.scene.add(this.group),new Bd().load(cT,i=>this.replaceCupWithHand(i.scene))}replaceCupWithHand(e){e.scale.setScalar(oT),e.position.set(0,aT,yi),e.rotation.x=0,e.rotation.y=-Math.PI/2,this.handMaterial=new ot({color:rT,emissive:4463152,roughness:.4,metalness:0,side:Ft}),e.traverse(t=>{t.isMesh&&(t.material=this.handMaterial)}),this.group.remove(this.cup),this.group.add(e),this.handRoot=e}get x(){return this._x}get cupY(){return ju}get cupTrainStartZ(){return yi}setTargetX(e){this.targetX=e}update(){this._x+=(this.targetX-this._x)*this.smoothing,this.group.position.x=this._x}aabb(){return{x:this._x,z:yi,halfX:lT,halfZ:uT}}dispose(){this.scene.remove(this.group),this.cupGeometry.dispose(),this.cupMaterial.dispose(),this.shadowGeometry.dispose(),this.shadowMaterial.dispose(),this.handMaterial?.dispose(),this.handRoot&&this.handRoot.traverse(e=>{const t=e;t.isMesh&&t.geometry?.dispose()})}}class fT{_targetX=0;_dragAnchorScreenX=null;_dragAnchorTargetX=0;pathHalfWidth;canvasWidth;constructor(e){this.pathHalfWidth=e.pathHalfWidth,this.canvasWidth=e.canvasWidth}get targetX(){return this._targetX}onPointerDown(e){this._dragAnchorScreenX=e,this._dragAnchorTargetX=this._targetX}onPointerMove(e){if(this._dragAnchorScreenX===null)return;const i=(e-this._dragAnchorScreenX)/this.canvasWidth*this.pathHalfWidth*3,s=this._dragAnchorTargetX+i;this._targetX=Math.max(-this.pathHalfWidth,Math.min(this.pathHalfWidth,s))}onPointerUp(){this._dragAnchorScreenX=null}}class pT{core;element;onPointerDown;onPointerMove;onPointerUp;constructor(e){this.core=new fT(e),this.element=e.element,this.onPointerDown=t=>{try{this.element.setPointerCapture(t.pointerId)}catch{}this.core.onPointerDown(t.clientX)},this.onPointerMove=t=>this.core.onPointerMove(t.clientX),this.onPointerUp=t=>{try{this.element.releasePointerCapture(t.pointerId)}catch{}this.core.onPointerUp()},this.element.addEventListener("pointerdown",this.onPointerDown),this.element.addEventListener("pointermove",this.onPointerMove),this.element.addEventListener("pointerup",this.onPointerUp),this.element.addEventListener("pointercancel",this.onPointerUp)}dispose(){this.element.removeEventListener("pointerdown",this.onPointerDown),this.element.removeEventListener("pointermove",this.onPointerMove),this.element.removeEventListener("pointerup",this.onPointerUp),this.element.removeEventListener("pointercancel",this.onPointerUp)}}const Yu=30,mT=30,gT=240,_T=.42,vT=.4,xT=.05,MT=5e-4,Ku=.08;function ST(n){return n>80?.64:n>30?.8:1}class yT{maxCups;_count=0;positions=[];velocities=[];anchorX=0;anchorY=0;anchorZ=0;constructor(e){this.maxCups=e.maxCups}get count(){return this._count}setCount(e){const t=Math.max(0,Math.min(this.maxCups,Math.floor(e)));for(;this._count<t;)this.positions.push(this.anchorX+(Math.random()-.5)*Ku,this.anchorY,this.anchorZ+(Math.random()-.5)*Ku),this.velocities.push(0,0,0),this._count+=1;for(;this._count>t;)this.positions.length-=3,this.velocities.length-=3,this._count-=1}removeAt(e){e<0||e>=this._count||(this.positions.splice(e*3,3),this.velocities.splice(e*3,3),this._count-=1)}step(e,t,i,s=1/60,r=1){if(this.anchorX=e,this.anchorY=t,this.anchorZ=i,s<=0||this._count===0)return;const o=this._count,a=_T*r,c=a*a,l=Math.pow(xT,s),u=MT,d=o<=30?1:Math.max(.05,1-(o-30)*.02),h=Math.pow(u*d,s),f=new Array(o),g=new Array(o),x=new Array(o);for(let S=0;S<o;S++){const b=S*3,y=this.positions[b],w=this.positions[b+1],T=this.positions[b+2];let C=(e-y)*Yu,v=(t-w)*mT,A=(i-T)*Yu;for(let L=0;L<o;L++){if(L===S)continue;const R=L*3,O=y-this.positions[R],H=w-this.positions[R+1],X=T-this.positions[R+2],N=O*O+H*H+X*X;if(N>0&&N<c){const I=Math.sqrt(N),D=a-I,W=gT*D/I;C+=O*W,v+=H*W,A+=X*W}}f[S]=C,g[S]=v,x[S]=A}for(let S=0;S<o;S++){const b=S*3;let y=this.velocities[b]+f[S]*s,w=this.velocities[b+1]+g[S]*s,T=this.velocities[b+2]+x[S]*s;w*=l;const C=this.positions[b]-e,v=this.positions[b+2]-i,A=C*C+v*v;if(A>1e-4){const L=Math.sqrt(A),R=C/L,O=v/L,H=y*R+T*O,X=H*R,N=H*O,I=y-X,D=T-N;y=X*l+I*h,T=N*l+D*h}else y*=l,T*=l;this.velocities[b]=y,this.velocities[b+1]=w,this.velocities[b+2]=T,this.positions[b]+=y*s,this.positions[b+1]+=w*s,this.positions[b+2]+=T*s}const m=vT*r,p=m*m;for(let S=0;S<2;S++)for(let b=0;b<o;b++){const y=b*3;for(let w=b+1;w<o;w++){const T=w*3,C=this.positions[y]-this.positions[T],v=this.positions[y+1]-this.positions[T+1],A=this.positions[y+2]-this.positions[T+2],L=C*C+v*v+A*A;if(L>=p||L===0)continue;const R=Math.sqrt(L),O=(m-R)*.5,H=C/R*O,X=v/R*O,N=A/R*O;this.positions[y]+=H,this.positions[y+1]+=X,this.positions[y+2]+=N,this.positions[T]-=H,this.positions[T+1]-=X,this.positions[T+2]-=N}}}cupPositions(){const e=new Array(this._count);for(let t=0;t<this._count;t++){const i=t*3;e[t]={x:this.positions[i],y:this.positions[i+1],z:this.positions[i+2]}}return e}}const bT=.18,sa=.65,ET=.22;class TT{core;scene;cupMeshes=[];cupGeometry;cupMaterial;finishMode=!1;coneStates=[];scoopGeometry=null;constructor(e){this.core=new yT(e),this.scene=e.scene,this.cupGeometry=new Ii(bT,0,sa,16,1,!0),this.cupMaterial=new ot({color:13144160,roughness:.5,metalness:0,side:Ft})}setCount(e){for(this.core.setCount(e);this.cupMeshes.length<this.core.count;){const t=this.finishMode?new ot({color:13144160,roughness:.5,metalness:0,side:Ft}):this.cupMaterial,i=new Be(this.cupGeometry,t);this.scene.add(i),this.cupMeshes.push(i),this.finishMode&&this.coneStates.push({filled:!1,color:16777215,scoopMesh:null,material:t})}for(;this.cupMeshes.length>this.core.count;){const t=this.cupMeshes.pop();if(t&&this.scene.remove(t),this.finishMode){const i=this.coneStates.pop();i&&(i.material.dispose(),i.scoopMesh&&(this.scene.remove(i.scoopMesh),i.scoopMesh.material.dispose()))}}}knockOffConeAt(e){if(e<0||e>=this.cupMeshes.length)return null;const t=this.cupMeshes.splice(e,1)[0];if(this.finishMode){const i=this.coneStates.splice(e,1)[0];if(i?.scoopMesh){const s=i.scoopMesh;this.scene.remove(s);const r=s.position.y-t.position.y;s.position.set(0,r,0),t.add(s)}}return this.core.removeAt(e),t}enterFinishMode(){if(!this.finishMode){this.finishMode=!0,this.scoopGeometry||(this.scoopGeometry=new Ei(ET,16,12)),this.coneStates.length=0;for(const e of this.cupMeshes){const t=new ot({color:13144160,roughness:.5,metalness:0,side:Ft});e.material=t,this.coneStates.push({filled:!1,color:16777215,scoopMesh:null,material:t})}}}get coneCount(){return this.cupMeshes.length}getConePosition(e){if(e<0||e>=this.cupMeshes.length)return null;const t=this.cupMeshes[e].position;return{x:t.x,y:t.y,z:t.z}}setConeFilled(e,t){if(!this.finishMode||e<0||e>=this.coneStates.length)return;const i=this.coneStates[e];if(t!==void 0&&(i.color=t),i.filled){i.scoopMesh&&t!==void 0&&i.scoopMesh.material.color.setHex(t);return}if(i.filled=!0,!this.scoopGeometry)return;const s=new ot({color:i.color,roughness:.4,metalness:0}),r=new Be(this.scoopGeometry,s);r.position.copy(this.cupMeshes[e].position),r.position.y+=sa*.55,this.scene.add(r),i.scoopMesh=r}setConeColor(e,t){if(!this.finishMode||e<0||e>=this.coneStates.length)return;const i=this.coneStates[e];i.color=t,i.filled&&i.scoopMesh&&i.scoopMesh.material.color.setHex(t)}releaseUnfilledCones(){if(!this.finishMode)return[];const e=[];for(let t=this.coneStates.length-1;t>=0;t--){if(this.coneStates[t].filled)continue;const i=this.cupMeshes.splice(t,1)[0],s=this.coneStates.splice(t,1)[0];this.core.removeAt(t),e.push({mesh:i,isFilled:!1,color:s.color})}return e}releaseFrontCone(){if(!this.finishMode||this.cupMeshes.length===0)return null;const e=this.cupMeshes.shift(),t=this.coneStates.shift();if(t.scoopMesh){const i=t.scoopMesh;this.scene.remove(i);const s=i.position.y-e.position.y;i.position.set(0,s,0),e.add(i)}return this.core.removeAt(0),{mesh:e,isFilled:t.filled,color:t.color}}update(e,t,i,s=1/60){const r=ST(this.cupMeshes.length);this.core.step(e,t,i,s,r);const o=this.core.cupPositions();for(let a=0;a<this.cupMeshes.length;a++){const c=o[a];if(c&&(this.cupMeshes[a].position.set(c.x,c.y,c.z),this.cupMeshes[a].scale.setScalar(r),this.finishMode)){const l=this.coneStates[a];l?.scoopMesh&&(l.scoopMesh.position.set(c.x,c.y+sa*.55*r,c.z),l.scoopMesh.scale.setScalar(r))}}}dispose(){for(const e of this.cupMeshes)this.scene.remove(e);if(this.cupMeshes.length=0,this.finishMode){for(const e of this.coneStates)e.material.dispose(),e.scoopMesh&&(this.scene.remove(e.scoopMesh),e.scoopMesh.material.dispose());this.coneStates.length=0}this.cupGeometry.dispose(),this.cupMaterial.dispose(),this.scoopGeometry?.dispose(),this.scoopGeometry=null}}class AT{distance=0;nextPickupAt;nextObstacleAt;buffer=[];pickupInterval;obstacleInterval;pathHalfWidth;rand;constructor(e){this.pickupInterval=e.pickupInterval,this.obstacleInterval=e.obstacleInterval,this.pathHalfWidth=e.pathHalfWidth,this.rand=e.seed!==void 0?$h(e.seed):Math.random,this.nextPickupAt=this.pickupInterval,this.nextObstacleAt=this.obstacleInterval}advance(e){for(this.distance+=e;this.distance>=this.nextPickupAt;)this.buffer.push({kind:"pickup",x:this.randomX(),distance:this.nextPickupAt}),this.nextPickupAt+=this.pickupInterval;for(;this.distance>=this.nextObstacleAt;)this.buffer.push({kind:"obstacle",x:this.randomX(),distance:this.nextObstacleAt}),this.nextObstacleAt+=this.obstacleInterval}takeSpawns(){const e=this.buffer;return this.buffer=[],e}randomX(){return(this.rand()*2-1)*this.pathHalfWidth}}const ra=.18,Ju=.65;class cn{static sharedGeometry=null;static sharedMaterial=null;mesh;scene;_alive=!0;constructor(e){this.scene=e.scene,cn.sharedGeometry||(cn.sharedGeometry=new Ii(ra,0,Ju,16,1,!0)),cn.sharedMaterial||(cn.sharedMaterial=new ot({color:13144160,emissive:1707525,roughness:.5,metalness:0,side:Ft})),this.mesh=new Be(cn.sharedGeometry,cn.sharedMaterial),this.mesh.position.set(e.x,Ju*.5,e.z),this.scene.add(this.mesh)}get alive(){return this._alive}get worldZ(){return this.mesh.position.z}advance(e){this.mesh.position.z+=e}aabb(){return{x:this.mesh.position.x,z:this.mesh.position.z,halfX:ra,halfZ:ra}}kill(){this._alive&&(this._alive=!1,this.scene.remove(this.mesh))}dispose(){this.kill()}}function wT(){cn.sharedGeometry?.dispose(),cn.sharedMaterial?.dispose(),cn.sharedGeometry=null,cn.sharedMaterial=null}const Vd=.9,Wd=.15,Xd=.6,fc=.3,RT=.3,CT=.4,PT=.8,IT=.4,LT=.35,NT="/paris-study-game/models/cat.glb",DT=16777215,UT=.4,OT=(()=>{let n=null;return()=>n??=new zt(Vd*2,Xd,Wd*2)})(),FT=(()=>{let n=null;return()=>n??=new Ei(fc,12,10)})(),zT=(()=>{let n=null;return()=>n??=new ot({color:13190726,roughness:.6})})(),BT=(()=>{let n=null;return()=>n??=new ot({color:7237230,roughness:.85,flatShading:!0})})();let Qr=null,Qu=!1;function Zd(){Qr||Qu||(Qu=!0,new Bd().load(NT,n=>{Qr=n.scene}))}class kT{root;kind;scene;_alive=!0;halfX;halfZ;constructor(e){this.scene=e.scene;let t=e.kind;if(t==="cat"&&!Qr&&(Zd(),t="rock"),this.kind=t,t==="scraper"){const i=new Be(OT(),zT());this.halfX=Vd,this.halfZ=Wd,i.position.set(e.x,Xd*.5,e.z),this.root=i}else if(t==="cat"){const i=Qr.clone(!0);i.scale.setScalar(CT),i.traverse(s=>{const r=s;if(!r.isMesh)return;const o=r.material;if(!o)return;const a=o.clone();a.emissive=new Ne(DT),a.emissiveMap=o.map??null,a.emissiveIntensity=UT,r.material=a}),i.position.set(e.x,PT,e.z),this.halfX=IT,this.halfZ=LT,this.root=i}else{const i=new Be(FT(),BT());this.halfX=fc,this.halfZ=RT,i.position.set(e.x,fc,e.z),i.scale.y=.7,this.root=i}this.scene.add(this.root)}get alive(){return this._alive}get worldZ(){return this.root.position.z}advance(e){this.root.position.z+=e}aabb(){return{x:this.root.position.x,z:this.root.position.z,halfX:this.halfX,halfZ:this.halfZ}}kill(){this._alive&&(this._alive=!1,this.scene.remove(this.root))}dispose(){this.kill()}}function eh(n,e){const t=Math.abs(n.x-e.x),i=Math.abs(n.z-e.z);return t<=n.halfX+e.halfX&&i<=n.halfZ+e.halfZ}class GT{root;counter;offCupsChanged;constructor(e){this.root=document.createElement("div"),this.root.className="psg-hud",this.counter=document.createElement("div"),this.counter.className="psg-hud-counter",this.counter.textContent=String(e.gameState.cups),this.root.appendChild(this.counter),e.parent.appendChild(this.root),this.offCupsChanged=e.gameState.events.on("cupsChanged",({cups:t})=>{this.counter.textContent=String(t)})}dispose(){this.offCupsChanged(),this.root.remove()}}function HT(n,e,t){if(e<=0)return-1;const i=1e-6;if(n<-t-i||n>t+i)return-1;const s=Math.max(-t,Math.min(t,n)),o=t*2/e,a=s+t-i;let c=Math.floor(a/o);return c=Math.max(0,Math.min(e-1,c)),c}function VT(n,e){const t=[];for(let i=0;i<n;i++)t.push(e*((2*i+1)/n-1));return t}const Pr=2.6,Yi=.18,th=.22,WT=.92,XT=.85,ZT=.05,$T=1.6,qT=16777215,jT=2864755,YT=13648964,nh=(()=>{let n=null;return()=>n??=new ot({color:16775122,roughness:.5})})(),KT=(()=>{let n=null;return()=>n??=new ot({color:16631147,roughness:.4})})();function JT(n){const e=document.createElement("canvas");e.width=512,e.height=256;const t=e.getContext("2d");if(!t)return new Kr(e);t.fillStyle="#ffffff",t.fillRect(0,0,e.width,e.height),t.strokeStyle="#cdcdcd",t.lineWidth=6,t.strokeRect(8,8,e.width-16,e.height-16),t.fillStyle="#1a1a1a";const i=QT(t,n,e.width-40,e.height-40);t.font=`700 ${i}px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`,t.textAlign="center",t.textBaseline="middle";const s=$d(t,n,e.width-40),r=i*1.1,o=s.length*r,a=e.height/2-o/2+r/2;for(let l=0;l<s.length;l++)t.fillText(s[l],e.width/2,a+l*r);const c=new Kr(e);return c.needsUpdate=!0,c.colorSpace=bt,c}function QT(n,e,t,i){for(let s=80;s>=28;s-=4)if(n.font=`700 ${s}px system-ui, -apple-system, sans-serif`,$d(n,e,t).length*s*1.1<=i)return s;return 28}function $d(n,e,t){const i=e.split(/\s+/),s=[];let r="";for(const o of i){const a=r?`${r} ${o}`:o;n.measureText(a).width<=t?r=a:(r&&s.push(r),r=o)}return r&&s.push(r),s}class eA{group;answers;scene;placards;placardMaterials;placardTextures;pillarGeometry;beamGeometry;placardGeometry;_alive=!0;constructor(e){this.scene=e.scene,this.answers=e.answers,this.group=new nn,this.group.position.z=e.z;const t=e.pathHalfWidth*2;this.pillarGeometry=new zt(Yi,Pr,Yi);const i=new Be(this.pillarGeometry,nh());i.position.set(-e.pathHalfWidth-Yi/2,Pr/2,0),this.group.add(i);const s=new Be(this.pillarGeometry,nh());s.position.set(e.pathHalfWidth+Yi/2,Pr/2,0),this.group.add(s),this.beamGeometry=new zt(t+Yi*2,th,Yi);const r=new Be(this.beamGeometry,KT());r.position.set(0,Pr+th/2,0),this.group.add(r);const o=VT(e.answers.length,e.pathHalfWidth),c=t/e.answers.length*WT;this.placardGeometry=new zt(c,XT,ZT),this.placards=[],this.placardMaterials=[],this.placardTextures=[];for(let l=0;l<e.answers.length;l++){const u=JT(e.answers[l]),d=new ot({color:qT,map:u,roughness:.4}),h=new Be(this.placardGeometry,d);h.position.set(o[l],$T,-.05),this.group.add(h),this.placards.push(h),this.placardMaterials.push(d),this.placardTextures.push(u)}this.scene.add(this.group)}get alive(){return this._alive}get worldZ(){return this.group.position.z}advance(e){this.group.position.z+=e}flashCorrect(e){e<0||e>=this.placardMaterials.length||this.placardMaterials[e].color.setHex(jT)}flashWrong(e){e<0||e>=this.placardMaterials.length||this.placardMaterials[e].color.setHex(YT)}kill(){this._alive&&(this._alive=!1,this.scene.remove(this.group))}dispose(){this.kill(),this.pillarGeometry.dispose(),this.beamGeometry.dispose(),this.placardGeometry.dispose();for(const e of this.placardMaterials)e.dispose();for(const e of this.placardTextures)e.dispose()}}const Ki=1,oa=.15,aa=.4;class tA{_state="normal";_multiplier=Ki;_rampElapsed=0;_rampFrom=Ki;_rampTo=Ki;_frozenPriorState=null;_frozenPriorMultiplier=Ki;get state(){return this._state}get multiplier(){return this._multiplier}enterApproach(){this._state!=="approaching"&&(this._state="approaching",this._rampFrom=this._multiplier,this._rampTo=oa,this._rampElapsed=0)}enterAtGate(){this._state!=="atGate"&&(this._state="atGate",this._multiplier=oa)}enterRecovering(){this._state!=="recovering"&&(this._state="recovering",this._rampFrom=this._multiplier,this._rampTo=Ki,this._rampElapsed=0)}freeze(){this._state!=="frozen"&&(this._frozenPriorState=this._state,this._frozenPriorMultiplier=this._multiplier,this._state="frozen",this._multiplier=0)}unfreeze(){this._state==="frozen"&&(this._state=this._frozenPriorState??"normal",this._multiplier=this._frozenPriorMultiplier,this._frozenPriorState=null)}update(e){if(this._state==="approaching"||this._state==="recovering"){this._rampElapsed=Math.min(aa,this._rampElapsed+e);const t=this._rampElapsed/aa;this._multiplier=this._rampFrom+(this._rampTo-this._rampFrom)*t,this._rampElapsed>=aa&&(this._state==="approaching"?(this._state="atGate",this._multiplier=oa):(this._state="normal",this._multiplier=Ki))}}}class nA{root;prompt;feedback;constructor(e){this.root=document.createElement("div"),this.root.className="psg-question",this.prompt=document.createElement("div"),this.prompt.className="psg-question-prompt",this.feedback=document.createElement("div"),this.feedback.className="psg-question-feedback",this.feedback.style.display="none",this.root.appendChild(this.prompt),this.root.appendChild(this.feedback),e.parent.appendChild(this.root)}show(e){this.prompt.textContent=e,this.prompt.style.display="",this.feedback.style.display="none",this.root.classList.add("psg-visible")}flashCorrect(){this.feedback.textContent="Correct!",this.feedback.classList.remove("psg-wrong"),this.feedback.classList.add("psg-correct"),this.feedback.style.display="",this.root.classList.add("psg-visible")}flashWrong(e){this.feedback.textContent=`It was: ${e}`,this.feedback.classList.remove("psg-correct"),this.feedback.classList.add("psg-wrong"),this.feedback.style.display="",this.root.classList.add("psg-visible")}hide(){this.root.classList.remove("psg-visible")}dispose(){this.root.remove()}}const iA=1;class sA{opts;slowMo=new tA;overlay;gate=null;gateState="idle";distanceSinceLastGate=0;flashTimer=0;firstGateScheduled=!1;constructor(e){this.opts={scene:e.scene,parentEl:e.parentEl,gameState:e.gameState,pathHalfWidth:e.pathHalfWidth,spawnAheadZ:e.spawnAheadZ,approachZ:e.approachZ,atGateZ:e.atGateZ,resolveZ:e.resolveZ,gateInterval:e.gateInterval,firstGateAt:e.firstGateAt??e.gateInterval,flashDuration:e.flashDuration??iA},this.overlay=new nA({parent:this.opts.parentEl})}get currentMultiplier(){return this.slowMo.multiplier}get currentGateZ(){return this.gate?.worldZ??null}update(e,t,i){if(this.slowMo.update(e),this.opts.gameState.phase==="Finishing"){this.slowMo.freeze(),this.overlay.hide(),this.gate&&(this.gate.dispose(),this.gate=null),this.gateState="idle";return}this.gate===null&&this.opts.gameState.phase==="Running"&&(!this.firstGateScheduled&&this.distanceSinceLastGate>=this.opts.firstGateAt||this.firstGateScheduled&&this.distanceSinceLastGate>=this.opts.gateInterval)&&this.spawnNextGate(),this.distanceSinceLastGate+=t,this.gate&&(this.gate.advance(t),this.gateState==="idle"&&this.gate.worldZ>=this.opts.approachZ&&(this.opts.gameState.approachGate(),this.slowMo.enterApproach(),this.overlay.show(this.opts.gameState.currentQuestion?.prompt??""),this.gateState="approaching"),this.gateState==="approaching"&&this.gate.worldZ>=this.opts.atGateZ&&(this.slowMo.enterAtGate(),this.gateState="atGate"),this.gateState==="atGate"&&this.gate.worldZ>=this.opts.resolveZ&&this.resolveCurrentGate(i)),this.gateState==="flashing"&&(this.flashTimer-=e,this.flashTimer<=0&&this.endFlash())}spawnNextGate(){const e=this.opts.gameState.peekNextQuestion();e&&(this.gate=new eA({scene:this.opts.scene,z:this.opts.spawnAheadZ,pathHalfWidth:this.opts.pathHalfWidth,answers:e.answers}),this.firstGateScheduled=!0,this.distanceSinceLastGate=0,this.gateState="idle")}resolveCurrentGate(e){if(!this.gate)return;const t=this.opts.gameState.currentQuestion;if(!t)return;const i=HT(e,t.answers.length,this.opts.pathHalfWidth);i===t.correctIndex?(this.gate.flashCorrect(i),this.overlay.flashCorrect()):(this.gate.flashWrong(i),this.gate.flashCorrect(t.correctIndex),this.overlay.flashWrong(t.answers[t.correctIndex])),this.opts.gameState.resolveAnswer(i),this.gateState="flashing",this.flashTimer=this.opts.flashDuration,this.slowMo.freeze()}endFlash(){this.slowMo.unfreeze(),this.slowMo.enterRecovering(),this.overlay.hide(),this.gate&&(this.gate.dispose(),this.gate=null),this.gateState="idle",this.distanceSinceLastGate=0}dispose(){this.gate&&this.gate.dispose(),this.gate=null,this.overlay.dispose()}}class rA{scene;mesh;geometry;material;constructor(e){this.scene=e.scene,this.geometry=new zt(e.pathHalfWidth*2,.04,.18),this.material=new ot({color:16767293,emissive:3812864,roughness:.5}),this.mesh=new Be(this.geometry,this.material),this.mesh.position.set(0,.025,e.z),this.scene.add(this.mesh)}dispose(){this.scene.remove(this.mesh),this.geometry.dispose(),this.material.dispose()}}class oA{root;card;opts;constructor(e){this.opts=e,this.root=document.createElement("div"),this.root.className="psg-results",this.card=document.createElement("div"),this.card.className="psg-results-card",this.root.appendChild(this.card),e.parent.appendChild(this.root)}show(e){if(this.card.innerHTML="",e.perfect){const l=document.createElement("div");l.className="psg-results-star",l.textContent="⭐",this.card.appendChild(l)}const t=document.createElement("div");t.className="psg-results-headline",t.textContent=e.perfect?"Perfect Run!":"Run Complete",this.card.appendChild(t);const i=document.createElement("div");i.className="psg-results-score",i.textContent=String(e.finalScore),this.card.appendChild(i);const s=document.createElement("div");s.className="psg-results-score-label",s.textContent="Final Score",this.card.appendChild(s);const r=document.createElement("div");r.className="psg-results-row",r.innerHTML=`<span>Accuracy</span><strong>${e.firstAttemptCorrect}/${e.totalQuestions}</strong>`,this.card.appendChild(r);const o=document.createElement("div");o.className="psg-results-row",o.innerHTML=`<span>Multiplier</span><strong>×${e.multiplier}</strong>`,this.card.appendChild(o);const a=document.createElement("div");a.className="psg-results-row",a.innerHTML=`<span>Ice Cream Cones</span><strong>${e.cups}</strong>`,this.card.appendChild(a);const c=document.createElement("button");c.className="psg-results-button",c.textContent="Play Again",c.onclick=()=>this.opts.onPlayAgain?.(),this.card.appendChild(c),this.root.classList.add("psg-visible")}hide(){this.root.classList.remove("psg-visible")}dispose(){this.root.remove()}}const aA=.6,cA=.4,ca=[-1.8,-.6,.6,1.8];function qd(n){return n==="left"?ca.slice(0,2):n==="right"?ca.slice(2,4):ca}const la=3,Ji=.12,ih=.18,sh=.5,lA=.18,uA=.06,rh=1.7;function hA(n,e,t,i="all"){if(Math.abs(e-t)>cA)return!1;for(const s of qd(i))if(Math.abs(n-s)<=aA)return!0;return!1}class oh{group;scene;poleGeometry;beamGeometry;nozzleGeometry;structureMaterial;nozzleMaterial;side;constructor(e){this.scene=e.scene,this.side=e.side??"all",this.group=new nn,this.group.position.z=e.z,this.structureMaterial=new ot({color:15658734,roughness:.5,metalness:.2}),this.nozzleMaterial=new ot({color:16775400,emissive:16775400,emissiveIntensity:.2,roughness:.4,metalness:.1}),this.poleGeometry=new zt(Ji,la,Ji);const t=new Be(this.poleGeometry,this.structureMaterial);t.position.set(-e.pathHalfWidth-Ji/2,la/2,0),this.group.add(t);const i=new Be(this.poleGeometry,this.structureMaterial);i.position.set(e.pathHalfWidth+Ji/2,la/2,0),this.group.add(i);const s=(e.pathHalfWidth+Ji)*2;this.beamGeometry=new zt(s,ih,Ji);const r=new Be(this.beamGeometry,this.structureMaterial);r.position.set(0,rh+sh/2+ih/2,0),this.group.add(r),this.nozzleGeometry=new Ii(lA,uA,sh,16);for(const o of qd(this.side)){const a=new Be(this.nozzleGeometry,this.nozzleMaterial);a.position.set(o,rh,0),this.group.add(a)}this.scene.add(this.group)}get worldZ(){return this.group.position.z}advance(e){this.group.position.z+=e}tryFill(e,t){return hA(e,t,this.group.position.z,this.side)}dispose(){this.scene.remove(this.group),this.poleGeometry.dispose(),this.beamGeometry.dispose(),this.nozzleGeometry.dispose(),this.structureMaterial.dispose(),this.nozzleMaterial.dispose()}}const dA=.55,fA=.4,Br=[{x:-1.8,color:16747937},{x:-.6,color:7440608},{x:.6,color:8970438},{x:1.8,color:16769400}];function jd(n){return n==="left"?Br.slice(0,2):n==="right"?Br.slice(2,4):Br}const ua=3,Qi=.12,ah=.18,ch=.5,pA=.16,mA=.06,lh=1.7;function gA(n,e,t,i="all"){if(Math.abs(e-t)>fA)return null;const s=i==="right"?2:0,r=jd(i);for(let o=0;o<r.length;o++)if(Math.abs(n-r[o].x)<=dA)return s+o;return null}class uh{group;scene;poleGeometry;beamGeometry;nozzleGeometry;structureMaterial;nozzleMaterials=[];side;constructor(e){this.scene=e.scene,this.side=e.side??"all",this.group=new nn,this.group.position.z=e.z,this.structureMaterial=new ot({color:15658734,roughness:.5,metalness:.2}),this.poleGeometry=new zt(Qi,ua,Qi);const t=new Be(this.poleGeometry,this.structureMaterial);t.position.set(-e.pathHalfWidth-Qi/2,ua/2,0),this.group.add(t);const i=new Be(this.poleGeometry,this.structureMaterial);i.position.set(e.pathHalfWidth+Qi/2,ua/2,0),this.group.add(i);const s=(e.pathHalfWidth+Qi)*2;this.beamGeometry=new zt(s,ah,Qi);const r=new Be(this.beamGeometry,this.structureMaterial);r.position.set(0,lh+ch/2+ah/2,0),this.group.add(r),this.nozzleGeometry=new Ii(pA,mA,ch,16);for(const o of jd(this.side)){const a=new ot({color:o.color,roughness:.4,metalness:.1,emissive:o.color,emissiveIntensity:.15});this.nozzleMaterials.push(a);const c=new Be(this.nozzleGeometry,a);c.position.set(o.x,lh,0),this.group.add(c)}this.scene.add(this.group)}get worldZ(){return this.group.position.z}advance(e){this.group.position.z+=e}tryColor(e,t){const i=gA(e,t,this.group.position.z,this.side);return i===null?null:Br[i].color}dispose(){this.scene.remove(this.group),this.poleGeometry.dispose(),this.beamGeometry.dispose(),this.nozzleGeometry.dispose(),this.structureMaterial.dispose();for(const e of this.nozzleMaterials)e.dispose();this.nozzleMaterials.length=0}}const Ir=2.4,es=.16,hh=.2,_A=1.4,vA=.7,xA=.05,MA=1.4;function SA(n){const e=document.createElement("canvas");e.width=512,e.height=256;const t=e.getContext("2d");if(!t)return new Kr(e);t.fillStyle="#fff7d2",t.fillRect(0,0,e.width,e.height),t.strokeStyle="#fdc56b",t.lineWidth=12,t.strokeRect(8,8,e.width-16,e.height-16),t.fillStyle="#1a1a1a",t.font='900 140px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',t.textAlign="center",t.textBaseline="middle",t.fillText(n,e.width/2,e.height/2+6);const i=new Kr(e);return i.colorSpace=bt,i}class yA{group;scene;placardMesh=null;placardMaterial=null;placardTexture=null;pillarGeometry;beamGeometry;placardGeometry;pillarMaterial;beamMaterial;constructor(e){this.scene=e.scene,this.group=new nn,this.group.position.z=e.z;const t=e.pathHalfWidth*2;this.pillarGeometry=new zt(es,Ir,es),this.pillarMaterial=new ot({color:16775122,roughness:.5});const i=new Be(this.pillarGeometry,this.pillarMaterial);i.position.set(-e.pathHalfWidth-es/2,Ir/2,0),this.group.add(i);const s=new Be(this.pillarGeometry,this.pillarMaterial);s.position.set(e.pathHalfWidth+es/2,Ir/2,0),this.group.add(s),this.beamGeometry=new zt(t+es*2,hh,es),this.beamMaterial=new ot({color:16631147,roughness:.4});const r=new Be(this.beamGeometry,this.beamMaterial);r.position.set(0,Ir+hh/2,0),this.group.add(r),this.placardGeometry=new zt(_A,vA,xA),this.scene.add(this.group)}setMultiplier(e){this.placardMesh&&this.group.remove(this.placardMesh),this.placardTexture?.dispose(),this.placardMaterial?.dispose(),this.placardTexture=SA(e),this.placardMaterial=new ot({color:16777215,map:this.placardTexture,roughness:.4}),this.placardMesh=new Be(this.placardGeometry,this.placardMaterial),this.placardMesh.position.set(0,MA,0),this.group.add(this.placardMesh)}get worldZ(){return this.group.position.z}setPosition(e){this.group.position.z=e}dispose(){this.scene.remove(this.group),this.pillarGeometry.dispose(),this.beamGeometry.dispose(),this.placardGeometry.dispose(),this.pillarMaterial.dispose(),this.beamMaterial.dispose(),this.placardTexture?.dispose(),this.placardMaterial?.dispose()}}const bA=1.6,EA=1.6,TA=16767293,AA=13847150,ts=.18,ha=Math.PI/2,Ds=.1,da=.12,dh=.1;class wA{group;mouthAnchor;scene;headMesh;headGeometry;headMaterial;tongueGeometry;tongueMaterial;eyeGeometry=null;pupilGeometry=null;eyeMaterial=null;pupilMaterial=null;radius;chompT=0;chomping=!1;locked=!1;constructor(e){this.scene=e.scene,this.radius=e.radius??bA;const t=e.y??EA;this.group=new nn,this.group.position.set(0,t,e.z),this.headGeometry=this.makeHeadGeometry(ts),this.headMaterial=new ot({color:TA,roughness:.45,metalness:.05,side:Ft}),this.headMesh=new Be(this.headGeometry,this.headMaterial),this.group.add(this.headMesh),this.tongueGeometry=new ro(this.radius*.7,32),this.tongueMaterial=new ot({color:AA,roughness:.7,side:Ft});const i=new Be(this.tongueGeometry,this.tongueMaterial);i.position.set(0,0,0),this.group.add(i);const s=this.radius*.2,r=s*.55,o=this.radius*.78,a=this.radius*.45,c=this.radius*.42;this.eyeGeometry=new Ei(s,16,12),this.eyeMaterial=new ot({color:16777215,roughness:.4}),this.pupilGeometry=new Ei(r,12,10),this.pupilMaterial=new ot({color:1118481,roughness:.5});for(const l of[-1,1]){const u=new Be(this.eyeGeometry,this.eyeMaterial);u.position.set(l*a,o,c),this.group.add(u);const d=new Be(this.pupilGeometry,this.pupilMaterial);d.position.set(l*a,o,c+s*.7),this.group.add(d)}this.mouthAnchor=new z(0,t,e.z+this.radius*.6),this.scene.add(this.group)}makeHeadGeometry(e){const t=e/2,i=Math.PI*2-e,s=new Ei(this.radius,48,32,t,i);return s.rotateZ(-Math.PI/2).rotateX(Math.PI/2),s}get worldZ(){return this.group.position.z}get isLocked(){return this.locked}advance(e){this.locked||(this.group.position.z+=e)}lock(){this.locked=!0,this.mouthAnchor.set(0,this.group.position.y,this.group.position.z+this.radius*.6)}chomp(){this.chompT=0,this.chomping=!0}update(e){if(!this.chomping)return;this.chompT+=e;const t=Ds+da+dh;let i;if(this.chompT>=t)this.chomping=!1,i=ha;else if(this.chompT<Ds){const r=this.chompT/Ds;i=ts+(ha-ts)*r}else if(this.chompT<Ds+da)i=ts;else{const r=(this.chompT-Ds-da)/dh;i=ts+(ha-ts)*r}const s=this.headGeometry;this.headGeometry=this.makeHeadGeometry(i),this.headMesh.geometry=this.headGeometry,s.dispose()}dispose(){this.scene.remove(this.group),this.headGeometry.dispose(),this.headMaterial.dispose(),this.tongueGeometry.dispose(),this.tongueMaterial.dispose(),this.eyeGeometry?.dispose(),this.pupilGeometry?.dispose(),this.eyeMaterial?.dispose(),this.pupilMaterial?.dispose()}}const fh={perfectBonus:10},RA=-24,CA=-44,PA=-64,IA=-84,LA=-104,NA=-150,DA=-5,UA=2,OA=12,FA=6,zA=.1,BA=.2,kA=.7,GA=.5;class HA{opts;results;fillStation=null;fillStation2=null;colorStation=null;colorStation2=null;multiplierGate=null;pacMan=null;phase="idle";inFlight=[];ingestTimer=0;settleTimer=0;resultsShown=!1;filledConeCount=0;fillPhaseEnded=!1;constructor(e){this.opts=e,this.results=new oA({parent:e.parentEl,onPlayAgain:()=>e.onPlayAgain?.()})}start(e){if(this.phase!=="idle")return;this.phase="scrolling",this.fillStation=new oh({scene:this.opts.scene,z:RA,pathHalfWidth:this.opts.pathHalfWidth,side:"left"}),this.colorStation=new uh({scene:this.opts.scene,z:CA,pathHalfWidth:this.opts.pathHalfWidth,side:"left"}),this.fillStation2=new oh({scene:this.opts.scene,z:PA,pathHalfWidth:this.opts.pathHalfWidth,side:"right"}),this.colorStation2=new uh({scene:this.opts.scene,z:IA,pathHalfWidth:this.opts.pathHalfWidth,side:"right"}),this.multiplierGate=new yA({scene:this.opts.scene,z:LA,pathHalfWidth:this.opts.pathHalfWidth});const t=this.opts.gameState.getResult(),i=t.perfect?" ★":"";this.multiplierGate.setMultiplier(`×${t.firstAttemptCorrect}${i}`),this.pacMan=new wA({scene:this.opts.scene,z:NA})}get inputDisabled(){return this.phase==="locked"||this.phase==="ingesting"||this.phase==="settling"||this.phase==="done"}get isResultsShown(){return this.resultsShown}update(e,t,i,s){if(!(this.phase==="idle"||this.phase==="done")){if(this.pacMan?.update(e),this.phase==="scrolling"){if(this.advanceStations(t),this.applyStationInteractions(s),!this.fillPhaseEnded&&this.multiplierGate&&this.multiplierGate.worldZ>UA){this.fillPhaseEnded=!0;const r=s.releaseUnfilledCones();for(const o of r)this.startFlyAway(o)}this.updateInFlight(e),this.pacMan&&this.pacMan.worldZ>=DA&&(this.pacMan.lock(),this.phase="locked");return}if(this.phase==="locked"){this.phase="ingesting",this.ingestTimer=0,s.enterFinishMode();return}if(this.phase==="ingesting"){if(this.ingestTimer+=e,this.ingestTimer>=zA&&s.coneCount>0){this.ingestTimer=0;const r=s.releaseFrontCone();r&&this.startFlight(r),this.pacMan?.chomp()}this.updateInFlight(e),s.coneCount===0&&this.inFlight.length===0&&(this.phase="settling",this.settleTimer=0);return}if(this.phase==="settling"){this.settleTimer+=e,this.settleTimer>=GA&&(this.showResults(),this.phase="done");return}}}advanceStations(e){this.fillStation?.advance(e),this.colorStation?.advance(e),this.fillStation2?.advance(e),this.colorStation2?.advance(e),this.multiplierGate&&this.multiplierGate.setPosition(this.multiplierGate.worldZ+e),this.pacMan?.advance(e)}applyStationInteractions(e){e.enterFinishMode();const t=[this.fillStation,this.fillStation2],i=[this.colorStation,this.colorStation2];for(let s=0;s<e.coneCount;s++){const r=e.getConePosition(s);if(r){for(const o of t)if(o&&o.tryFill(r.x,r.z)){e.setConeFilled(s);break}for(const o of i){if(!o)continue;const a=o.tryColor(r.x,r.z);if(a!==null){e.setConeColor(s,a);break}}}}}startFlight(e){e.isFilled&&(this.filledConeCount+=1);const t=e.mesh.position.clone(),i=this.pacMan?.mouthAnchor.clone()??t.clone();this.inFlight.push({mesh:e.mesh,isFilled:e.isFilled,startPos:t,targetPos:i,elapsed:0})}startFlyAway(e){const t=e.mesh.position.clone(),i=(Math.random()-.5)*4,s=new z(t.x+i,t.y+FA,t.z+OA);this.inFlight.push({mesh:e.mesh,isFilled:!1,startPos:t,targetPos:s,elapsed:0})}updateInFlight(e){for(let t=this.inFlight.length-1;t>=0;t--){const i=this.inFlight[t];i.elapsed+=e;const s=Math.min(1,i.elapsed/BA),r=i.startPos.x+(i.targetPos.x-i.startPos.x)*s,o=i.startPos.z+(i.targetPos.z-i.startPos.z)*s,a=i.startPos.y+(i.targetPos.y-i.startPos.y)*s,c=Math.sin(s*Math.PI)*kA;i.mesh.position.set(r,a+c,o);const l=1-.6*s;if(i.mesh.scale.set(l,l,l),s>=1){this.opts.scene.remove(i.mesh);const u=i.mesh.material;if(Array.isArray(u))for(const d of u)d.dispose();else u.dispose();for(const d of i.mesh.children){const h=d.material;if(Array.isArray(h))for(const f of h)f.dispose();else h?.dispose()}this.inFlight.splice(t,1)}}}showResults(){if(this.resultsShown)return;this.resultsShown=!0,this.opts.gameState.phase==="Finishing"&&this.opts.gameState.completeFinish();const e=this.opts.gameState.getResult(),t=e.firstAttemptCorrect,i=e.cups,s=i*t+(e.perfect?this.opts.perfectBonus:0);this.results.show({cups:i,firstAttemptCorrect:e.firstAttemptCorrect,totalQuestions:e.totalQuestions,perfect:e.perfect,multiplier:t,finalScore:s})}dispose(){for(const e of this.inFlight)this.opts.scene.remove(e.mesh);this.inFlight.length=0,this.fillStation?.dispose(),this.colorStation?.dispose(),this.fillStation2?.dispose(),this.colorStation2?.dispose(),this.multiplierGate?.dispose(),this.pacMan?.dispose(),this.results.dispose()}}class VA{button;modal;opts;isOpen=!1;constructor(e){this.opts=e,this.button=document.createElement("button"),this.button.className="psg-pause-btn",this.button.setAttribute("aria-label","Pause"),this.button.textContent="⏸",this.button.onclick=()=>this.open(),e.parent.appendChild(this.button),this.modal=document.createElement("div"),this.modal.className="psg-menu";const t=document.createElement("div");t.className="psg-menu-card",this.modal.appendChild(t),e.parent.appendChild(this.modal);const i=document.createElement("h2");i.className="psg-menu-title",i.textContent="Paused",t.appendChild(i);const s=document.createElement("button");s.className="psg-menu-button",s.textContent="Resume",s.onclick=()=>this.close(),t.appendChild(s);const r=document.createElement("button");r.className="psg-menu-button psg-secondary",r.textContent="Restart Run",r.onclick=()=>e.onRestart(),t.appendChild(r);const o=document.createElement("div");o.className="psg-menu-section-label",o.textContent="Level",t.appendChild(o);for(const a of[1,2]){const c=document.createElement("button");c.className="psg-menu-button",a!==e.currentLevel?c.classList.add("psg-secondary"):c.classList.add("psg-active"),c.textContent=`Level ${a}${a===e.currentLevel?" (current)":""}`,c.onclick=()=>e.onSelectLevel(a),t.appendChild(c)}}open(){this.isOpen||(this.isOpen=!0,this.modal.classList.add("psg-visible"),this.opts.onPauseChange(!0))}close(){this.isOpen&&(this.isOpen=!1,this.modal.classList.remove("psg-visible"),this.opts.onPauseChange(!1))}dispose(){this.button.remove(),this.modal.remove()}}const WA=.18,XA=.5,ZA=18,fa=1.8,$A={scraper:3,cat:2,rock:2},ns=2.4,qA=120,pa=-55,ph=4,jA=6,YA=11,KA=200,JA=30,QA=14,ew=-22,tw=-10,nw=12;function iw(n){const{rootEl:e,gameState:t,persistence:i}=n,s=n.speed??nw,r=new bE({parent:e}),o=new EE({scene:r.scene,width:ns*2,length:qA}),a=new dT({scene:r.scene}),c=new TT({scene:r.scene,maxCups:KA}),l=new pT({element:r.renderer.domElement,pathHalfWidth:ns,canvasWidth:r.renderer.domElement.clientWidth||1}),u=new AT({pickupInterval:jA,obstacleInterval:YA,pathHalfWidth:ns}),d=new GT({parent:e,gameState:t}),h=new sA({scene:r.scene,parentEl:e,gameState:t,pathHalfWidth:ns,spawnAheadZ:pa,approachZ:ew,atGateZ:tw,resolveZ:yi,gateInterval:JA,firstGateAt:QA}),f=new rA({scene:r.scene,pathHalfWidth:ns,z:yi}),g=new HA({scene:r.scene,parentEl:e,gameState:t,pathHalfWidth:ns,cupY:a.cupY,perfectBonus:fh.perfectBonus,onPlayAgain:()=>{n.onPlayAgain?n.onPlayAgain():location.reload()}}),x=new VA({parent:e,currentLevel:n.level??1,onPauseChange:I=>r.setPaused(I),onRestart:()=>{n.onRestart?n.onRestart():location.reload()},onSelectLevel:I=>{if(n.onSelectLevel)n.onSelectLevel(I);else{const D=new URL(window.location.href);D.searchParams.set("level",String(I)),window.location.href=D.toString()}}}),m=[],p=[],S=[];let b=!1,y=!1;function w(I){const D=Math.random()*Math.PI*2,W=4+Math.random()*4;S.push({mesh:I,vx:Math.cos(D)*W,vy:6+Math.random()*4,vz:Math.sin(D)*W,spinX:(Math.random()-.5)*14,spinZ:(Math.random()-.5)*14,lifetime:fa})}function T(I,D){const W=I.position.x-D,J=W===0?Math.random()<.5?-1:1:Math.sign(W);S.push({mesh:I,vx:J*(5+Math.random()*4),vy:4+Math.random()*3,vz:1.5+Math.random()*3.5,spinX:(Math.random()-.5)*14,spinZ:(Math.random()-.5)*14,lifetime:fa})}function C(I,D,W){const J=c.knockOffConeAt(I);J&&(T(J,D),t.hitObstacle(1))}function v(I){for(let D=0;D<I;D++){const W=c.coneCount-1;if(W<0)break;const J=c.knockOffConeAt(W);if(!J)break;w(J)}}const A=t.events.on("wrongAnswerSplash",({lost:I})=>{v(I)});function L(I){const D=Math.random()*Math.PI*2,W=5+Math.random()*5;S.push({mesh:I.root,vx:Math.cos(D)*W,vy:8+Math.random()*4,vz:Math.sin(D)*W,spinX:(Math.random()-.5)*18,spinZ:(Math.random()-.5)*18,lifetime:fa*1.4})}function R(I){for(let D=S.length-1;D>=0;D--){const W=S[D];W.lifetime-=I,W.vy-=ZA*I,W.mesh.position.x+=W.vx*I,W.mesh.position.y+=W.vy*I,W.mesh.position.z+=W.vz*I,W.mesh.rotation.x+=W.spinX*I,W.mesh.rotation.z+=W.spinZ*I,(W.lifetime<=0||W.mesh.position.y<-2)&&(r.scene.remove(W.mesh),S.splice(D,1))}}const O=t.events.on("cupsChanged",({cups:I})=>{b||c.setCount(I)});c.setCount(t.cups),Zd();function H(I){if(I.kind==="pickup")m.push(new cn({scene:r.scene,x:I.x,z:pa}));else{const D=Math.random()<.5?"scraper":"cat";p.push(new kT({scene:r.scene,x:I.x,z:pa,kind:D}))}}function X(){const I=[];for(const D of c.core.cupPositions())I.push({x:D.x,y:D.y,z:D.z});return I}function N(I){if(!b&&t.phase==="Finishing"){b=!0,c.enterFinishMode();const J=X();g.start(J);for(const re of m)re.kill();for(const re of p)re.kill();m.length=0,p.length=0}const D=b?1:h.currentMultiplier,W=s*I*D;if(g.inputDisabled||a.setTargetX(l.core.targetX),a.update(),o.advance(W),!b){u.advance(W);const J=h.slowMo.state,re=J==="approaching"||J==="atGate";for(const ve of u.takeSpawns())re&&ve.kind==="obstacle"||H(ve);for(let ve=m.length-1;ve>=0;ve--){const Le=m[ve];Le.advance(W),Le.worldZ>ph&&(Le.kill(),m.splice(ve,1))}for(let ve=p.length-1;ve>=0;ve--){const Le=p[ve];Le.advance(W),Le.worldZ>ph&&(Le.kill(),p.splice(ve,1))}const _e=h.currentGateZ;if(_e!==null)for(let ve=p.length-1;ve>=0;ve--)Math.abs(p[ve].worldZ-_e)<=1&&(p[ve].kill(),p.splice(ve,1));const Se=a.aabb();for(let ve=m.length-1;ve>=0;ve--){const Le=m[ve];eh(Se,Le.aabb())&&(t.collectCup(),Le.kill(),m.splice(ve,1))}for(let ve=p.length-1;ve>=0;ve--){const Re=p[ve].aabb();for(let q=c.coneCount-1;q>=0;q--){const le=c.getConePosition(q);le&&Math.abs(le.x-Re.x)<=WA+Re.halfX&&Math.abs(le.z-Re.z)<=XA+Re.halfZ&&C(q,Re.x,Re.z)}}for(let ve=p.length-1;ve>=0;ve--){const Le=p[ve];if(eh(Se,Le.aabb())){const Re=Le.aabb(),q=$A[Le.kind]??1;for(let le=0;le<q;le++){const te=c.coneCount-1;if(te<0)break;C(te,Re.x,Re.z)}Le.kind==="cat"?L(Le):Le.kill(),p.splice(ve,1)}}}if(R(I),h.update(I,W,a.x),c.update(a.x,a.cupY,a.cupTrainStartZ,I),b&&(g.update(I,W,a.x,c),!y&&t.phase==="Complete"&&i)){const J=t.getResult();if(J.mode==="daily"&&J.dateYmd){t0(i,J.dateYmd);const re=J.firstAttemptCorrect,_e=J.cups*re+(J.perfect?fh.perfectBonus:0),Se=J.totalQuestions===0?0:J.firstAttemptCorrect/J.totalQuestions;i.setLastDailyResult({date:J.dateYmd,score:_e,accuracy:Se})}y=!0}}return r.setUpdate(N),r.start(),{dispose(){O(),A(),r.stop();for(const I of m)I.dispose();for(const I of p)I.dispose();for(const I of S)r.scene.remove(I.mesh);m.length=0,p.length=0,S.length=0,x.dispose(),g.dispose(),h.dispose(),f.dispose(),c.dispose(),a.dispose(),o.dispose(),d.dispose(),l.dispose(),r.dispose(),wT()}}}const Yd="psg.level";function Kd(n){try{localStorage.setItem(Yd,String(n))}catch{}}function sw(){const n=new URLSearchParams(window.location.search),e=Number(n.get("level"));if(e===1||e===2)return Kd(e),e;try{const t=Number(localStorage.getItem(Yd));if(t===1||t===2)return t}catch{}return 1}async function rw(){const n=document.getElementById("app");if(!n)return;let e;try{e=await Z_()}catch(r){n.innerText=`Boot error: ${r instanceof Error?r.message:String(r)}`;return}const t=new Q_;let i=null;function s(r){i&&(i.dispose(),i=null);const o=new URL(window.location.href);o.searchParams.set("level",String(r)),history.replaceState(null,"",o.toString()),Kd(r);const a=t.getSettings(),c=e.questions.filter(d=>d.level===r);if(c.length===0){n.innerText=`No questions configured for level ${r}.`;return}const l=Y_(c,Math.max(1,a.questionCount)),u=new i0;u.startRun(l,{mode:"practice"}),i=iw({rootEl:n,gameState:u,level:r,onSelectLevel:d=>s(d),onRestart:()=>s(r),onPlayAgain:()=>s(r)})}s(sw())}rw();
