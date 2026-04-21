module.exports = [
"[project]/apps/web/src/components/dashboard/GradientBackground.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>GradientBackground
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
function getGradient(hour) {
    if (hour >= 6 && hour < 12) {
        return "linear-gradient(140deg, #FFE7FF 0%, #f8f8ff 38%, #edf4ff 68%, #d8e5ff 100%)";
    }
    if (hour >= 12 && hour < 18) {
        return "linear-gradient(140deg, #f8f8ff 0%, #edf4ff 40%, #dee2ff 72%, #f8f8ff 100%)";
    }
    if (hour >= 18 && hour < 22) {
        return "linear-gradient(145deg, #FFE7FF 0%, #dee2ff 30%, #b8c0ff 68%, #8e97de 100%)";
    }
    return "linear-gradient(145deg, #51579d 0%, #394188 38%, #2a316f 70%, #20285e 100%)";
}
function getTextClass(hour) {
    if (hour >= 22 || hour < 6) return "text-[#d6d8f2]";
    if (hour >= 18) return "text-[#e6e2f2]";
    return "text-foreground";
}
function GradientBackground({ children }) {
    const [hour] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>new Date().getHours());
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `min-h-screen transition-all duration-1000 ${getTextClass(hour)}`,
        style: {
            background: getGradient(hour)
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/apps/web/src/components/dashboard/GradientBackground.tsx",
        lineNumber: 35,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=apps_web_src_components_dashboard_GradientBackground_tsx_13h3q2l._.js.map