(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/apps/web/src/lib/env.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "env",
    ()=>env,
    "hasClerkConfig",
    ()=>hasClerkConfig,
    "hasSupabaseAdminConfig",
    ()=>hasSupabaseAdminConfig,
    "hasSupabasePublicConfig",
    ()=>hasSupabasePublicConfig,
    "missingSetupItems",
    ()=>missingSetupItems
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
const env = {
    clerkPublishableKey: ("TURBOPACK compile-time value", "pk_test_Y29tcG9zZWQtZ29sZGZpc2gtNzYuY2xlcmsuYWNjb3VudHMuZGV2JA"),
    clerkSecretKey: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.CLERK_SECRET_KEY,
    supabaseUrl: ("TURBOPACK compile-time value", "https://ljlkzuljrikahklqltgb.supabase.co"),
    supabaseAnonKey: ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxqbGt6dWxqcmlrYWhrbHFsdGdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3MjYwMDIsImV4cCI6MjA5MjMwMjAwMn0.pXZFNIsPZsyM5W4b457kj_9UzM_nxIaI_s9skeeFBwg"),
    supabaseServiceRoleKey: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.SUPABASE_SERVICE_ROLE_KEY
};
function hasClerkConfig() {
    return Boolean(env.clerkPublishableKey && env.clerkSecretKey);
}
function hasSupabasePublicConfig() {
    return Boolean(env.supabaseUrl && env.supabaseAnonKey);
}
function hasSupabaseAdminConfig() {
    return Boolean(env.supabaseUrl && env.supabaseServiceRoleKey);
}
function missingSetupItems() {
    const missing = [];
    if (!hasClerkConfig()) {
        missing.push("Clerk keys");
    }
    if (!hasSupabasePublicConfig()) {
        missing.push("Supabase public keys");
    }
    if (!hasSupabaseAdminConfig()) {
        missing.push("Supabase service role key");
    }
    return missing;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/components/providers/RootProviders.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RootProviders
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@clerk/nextjs/dist/esm/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$env$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/env.ts [app-client] (ecmascript)");
"use client";
;
;
;
function RootProviders({ children }) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$env$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasClerkConfig"])()) {
        return children;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ClerkProvider"], {
        children: children
    }, void 0, false, {
        fileName: "[project]/apps/web/src/components/providers/RootProviders.tsx",
        lineNumber: 15,
        columnNumber: 10
    }, this);
}
_c = RootProviders;
var _c;
__turbopack_context__.k.register(_c, "RootProviders");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=apps_web_src_028_leq._.js.map