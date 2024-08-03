import React, {useState} from 'react';
import Container from "../../../components/Container.jsx";
import {Button, Input, Modal, Pagination, Row, Space, Table, Typography} from "antd";
import {get} from "lodash";
import {useTranslation} from "react-i18next";
import usePaginateQuery from "../../../hooks/api/usePaginateQuery.js";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import CreateAdmin from "../components/CreateAdmin.jsx";
import {PlusOutlined} from "@ant-design/icons";
const { Title } = Typography

const AdminsContainer = () => {
    const {t} = useTranslation();
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [isModalOpen, setModalOpen] = useState(false);
    const [searchKey,setSearchKey] = useState();
    const {data,isLoading,isFetching} = usePaginateQuery({
        key: KEYS.admin_list,
        url: URLS.admin_list,
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
            title: t("Role"),
            dataIndex: "role",
            key: "role",
        }
    ]
    return (
        <Container>
            <Space direction={"vertical"} style={{width: "100%"}} size={"middle"}>
                <Title level={4}>{t("Admins")}</Title>
                <Modal
                    title={t('Create new admin')}
                    open={isModalOpen}
                    onCancel={() => setModalOpen(false)}
                    footer={null}
                >
                    <CreateAdmin setIsModalOpen={setModalOpen}/>
                </Modal>
                <Space size={"middle"}>
                    <Input.Search
                        placeholder={t("Search")}
                        onSearch={(value) => setSearchKey(value)}
                        allowClear
                    />
                    <Button
                        icon={<PlusOutlined />}
                        type={"primary"}
                        onClick={() => setModalOpen(true)}
                    >
                        {t("New")}
                    </Button>
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

export default AdminsContainer;
