import type { RouteObject } from "react-router-dom";
import AdminLayout from "../components/layouts/admin/AdminLayout";
import React from "react";
import { AdminPage, AdminPermissionsPage, AdminRankingPage, AdminTeamsPage, AdminTournamentsPage, AdminUsersPage } from "../pages/admin";

export const adminRoutes: RouteObject[] = [
    {
        path: "/admin",
        element: React.createElement(AdminLayout),
        children: [
            { index: true, element: React.createElement(AdminPage) },
            { path: "tournaments", element: React.createElement(AdminTournamentsPage) },
            { path: "teams", element: React.createElement(AdminTeamsPage) },
            { path: "ranking", element: React.createElement(AdminRankingPage) },
            { path: "users", element: React.createElement(AdminUsersPage) },
            { path: "permissions", element: React.createElement(AdminPermissionsPage) },
        ],
    },
];
