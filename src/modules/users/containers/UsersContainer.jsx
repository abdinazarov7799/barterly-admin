import React, {useState} from 'react';
import Container from "../../../components/Container.jsx";
import {Input, Pagination, Row, Space, Table, Typography} from "antd";
import {get} from "lodash";
import {useTranslation} from "react-i18next";
import usePaginateQuery from "../../../hooks/api/usePaginateQuery.js";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
const {Title} = Typography

const UsersContainer = () => {
    const {t} = useTranslation();
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [searchKey,setSearchKey] = useState();
    const {data,isLoading,isFetching} = usePaginateQuery({
        key: KEYS.user_list,
        url: URLS.user_list,
        params: {
            params: {
                size,
                search: searchKey
            }
        },
        page
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
            key: "name"
        },
        {
            title: t("Username"),
            dataIndex: "username",
            key: "username",
        },
        {
            title: t("Email"),
            dataIndex: "email",
            key: "email",
        },
        {
            title: t("Phone number"),
            dataIndex: "phoneNumber",
            key: "phoneNumber",
        },
        {
            title: t("User type"),
            dataIndex: "userType",
            key: "userType",
        },
    ]
    return (
        <Container>
            <Space direction={"vertical"} style={{width: "100%"}} size={"middle"}>
                <Title level={4}>{t("Users")}</Title>
                <Space size={"middle"}>
                    <Input.Search
                        placeholder={t("Search")}
                        onSearch={(value) => setSearchKey(value)}
                        allowClear
                    />
                </Space>

                <Table
                    columns={columns}
                    dataSource={get(data,'data.content',[])}
                    bordered
                    size={"middle"}
                    pagination={false}
                    loading={isLoading || isFetching}
                />

                <Row justify={"end"} style={{marginTop: 10}}>
                    <Pagination
                        current={isNaN(page + 1) ? 1 : page + 1}
                        onChange={(page) => setPage(page - 1)}
                        total={isNaN(get(data, 'data.totalPages') * 10) ? 0 : get(data, 'data.totalPages') * 10}
                        showSizeChanger={false}
                    />
                </Row>
            </Space>
        </Container>
    );
};

export default UsersContainer;
