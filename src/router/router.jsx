import React, {Suspense} from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";


// LAYOUTS
import DashboardLayout from "../layouts/dashboard/DashboardLayout.jsx";
import AuthLayout from "../layouts/auth/AuthLayout.jsx";
// LAYOUTS

// AUTH
import IsAuth from "../services/auth/IsAuth";
import IsGuest from "../services/auth/IsGuest";
import LoginPage from "../modules/auth/pages/LoginPage";
// AUTH

// 404
import NotFoundPage from  "../modules/auth/pages/NotFoundPage";
// 404

// PAGES
import TranslationPage from "../modules/translation/pages/TranslationPage.jsx";
import OverlayLoader from "../components/OverlayLoader.jsx";
import UsersPage from "../modules/users/pages/UsersPage.jsx";
import AdminsPage from "../modules/admins/pages/AdminsPage.jsx";
import RegionPage from "../modules/region/pages/RegionPage.jsx";
import CurrencyPage from "../modules/currency/pages/CurrencyPage.jsx";
import CharacteristicsPage from "../modules/characteristics/pages/CharacteristicsPage.jsx";
import CharacteristicsValuePage from "../modules/characteristics-value/pages/CharacteristicsValuePage.jsx";
import CategoryPage from "../modules/category/pages/CategoryPage.jsx";
import CategoryCharacteristicsPage from "../modules/category-characteristics/pages/CategoryCharacteristicsPage.jsx";
import CategoryCharacteristicsValuePage
  from "../modules/category-characteristics-value/pages/CategoryCharacteristicsValuePage.jsx";
import RolesPage from "../modules/roles/pages/RolesPage.jsx";
import CitiesPage from "../modules/cities/pages/CitiesPage.jsx";
import NeighborhoodPage from "../modules/neighborhood/pages/NeighborhoodPage.jsx";
// PAGES


const Router = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<OverlayLoader />}>
        <IsAuth>
          <Routes>
            <Route path={"/"} element={<DashboardLayout />}>
              <Route
                  path={"/cities"}
                  element={<CitiesPage />}
              />
              <Route
                  path={"/regions"}
                  element={<RegionPage />}
              />
              <Route
                  path={"/neighborhoods"}
                  element={<NeighborhoodPage />}
              />
              <Route
                  path={"/currency"}
                  element={<CurrencyPage />}
              />
              <Route
                  path={"/characteristics"}
                  element={<CharacteristicsPage />}
              />
              <Route
                  path={"/characteristics-value"}
                  element={<CharacteristicsValuePage />}
              />
              <Route
                  path={"/category"}
                  element={<CategoryPage />}
              />
              <Route
                  path={"/category-characteristics"}
                  element={<CategoryCharacteristicsPage />}
              />
              <Route
                  path={"/category-characteristics-value"}
                  element={<CategoryCharacteristicsValuePage />}
              />
              <Route
                  path={"/users"}
                  element={<UsersPage />}
              />
              <Route
                  path={"/admins"}
                  element={<AdminsPage />}
              />
              <Route
                  path={"/roles"}
                  element={<RolesPage />}
              />
              <Route
                  path={"/translations"}
                  element={<TranslationPage />}
              />
              <Route
                  path={"auth/*"}
                  element={<Navigate to={"/users"} replace />}
              />
              <Route
                  path={"/"}
                  element={<Navigate to={"/users"} replace />}
              />
              <Route path={"*"} element={<NotFoundPage />} />
            </Route>
          </Routes>
        </IsAuth>

        <IsGuest>
          <Routes>
            <Route path={"/auth"} element={<AuthLayout />}>
              <Route index element={<LoginPage />} />
            </Route>
            <Route path={"*"} element={<Navigate to={"/auth"} replace />} />
          </Routes>
        </IsGuest>
      </Suspense>
    </BrowserRouter>
  );
};

export default Router;
