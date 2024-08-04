import React from 'react';
import Container from "../../../components/Container.jsx";
import {Space, Table, Typography} from "antd";
import {get} from "lodash";
import {useTranslation} from "react-i18next";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import useGetAllQuery from "../../../hooks/api/useGetAllQuery.js";
const { Title } = Typography

const RolesContainer = () => {
    const {t} = useTranslation();
    const {data,isLoading,isFetching} = useGetAllQuery({
        key: KEYS.role_list,
        url: URLS.role_list,
      });

    const columns = [
        {
            title: "№",
            key: "index",
            render: (props, data, index) => index + 1
        },
        {
            title: t("ID"),
            dataIndex: "id",
            key: "id",
        },
        {
            title: t("Name"),
            dataIndex: "name",
            key: "name",
        },
    ]
    return (
        <Container>
            <Space direction={"vertical"} style={{width: "100%"}} size={"middle"}>
                <Title level={4}>{t("Roles")}</Title>

                <Table
                    columns={columns}
                    dataSource={get(data,'data',[])}
                    bordered
                    size={"middle"}
                    pagination={false}
                    loading={isLoading || isFetching}
                />
            </Space>
        </Container>
    );
};

export default RolesContainer;
