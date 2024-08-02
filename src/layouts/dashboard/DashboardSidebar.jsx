import {Menu} from "antd";
import {get} from "lodash";
import React from "react";
import Sider from "antd/es/layout/Sider";
import {useLocation, useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";

const DashboardSidebar = () => {
    const { t } = useTranslation();
    const location = useLocation()
    const navigate = useNavigate()

    const items = [
        {
            label: t("Cities"),
            key: "/cities",
        },
        {
            label: t("Regions"),
            key: "/regions",
        },
        {
            label: t("Neighborhoods"),
            key: "/neighborhoods",
        },
        {
            label: t("Currency"),
            key: "/currency",
        },
        {
            label: t("Characteristics"),
            key: "/characteristics",
        },
        {
            label: t("Characteristics value"),
            key: "/characteristics-value",
        },
        {
            label: t("Category"),
            key: "/category",
        },
        {
            label: t("Category characteristics"),
            key: "/category-characteristics",
        },
        {
            label: t("Category characteristics value"),
            key: "/category-characteristics-value",
        },
        {
            label: t("Users"),
            key: "/users",
        },
        {
            label: t("Admins"),
            key: "/admins",
        },
        {
            label: t("Roles"),
            key: "/roles",
        },
        // {
        //     label: t("Translations"),
        //     key: "/translations",
        // },
    ];

  return(
      <Sider
          theme={"light"}
          style={{
              overflow: 'auto',
              height: '100vh',
              position: 'fixed',
              left: 0,
              top: 0,
              bottom: 0,
          }}
      >
          <Menu
              mode="inline"
              style={{padding: 5}}
              onSelect={(event) => {navigate(get(event,'key','/'))}}
              items={items}
              selectedKeys={[get(location,'pathname','')]}
          />

      </Sider>
  )
}
export default DashboardSidebar
