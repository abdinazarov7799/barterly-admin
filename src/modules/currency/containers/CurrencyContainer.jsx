import React, {useState} from 'react';
import {useTranslation} from "react-i18next";
import usePaginateQuery from "../../../hooks/api/usePaginateQuery.js";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import Container from "../../../components/Container.jsx";
import {Button, Image, Input, Modal, Pagination, Popconfirm, Row, Space, Table, Typography} from "antd";
import {get} from "lodash";
import {DeleteOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";
import useDeleteQuery from "../../../hooks/api/useDeleteQuery.js";
import CreateEditCurrency from "../components/CreateEditCurrency.jsx";
const { Title } = Typography;

const CurrencyContainer = () => {
    const {t} = useTranslation();
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [searchKey,setSearchKey] = useState();
    const [itemId, setItemId] = useState(null);
    const [isCreateModalOpenCreate, setIsCreateModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)

    const {data,isLoading,isFetching} = usePaginateQuery({
        key: KEYS.currency_list,
        url: URLS.currency_list,
        params: {
            params: {
                size,
                search: searchKey
            }
        },
        page
    });

    const { mutate } = useDeleteQuery({
        listKeyId: KEYS.currency_list
    });

    const useDelete = (id) => {
        mutate({url: `${URLS.currency_delete}/${id}`})
    }

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
        {
            title: t("Currency code"),
            dataIndex: "currencyCode",
            key: "currencyCode",
        },
        {
            title: t("Image"),
            key: "imageUrl",
            dataIndex: "imageUrl",
            width: 100,
            render: (props) => <Image src={props} width={80} height={50} />
        },
        {
            title: t("Edit"),
            key: "edit",
            width: 60,
            render: (props) => (
                <Button icon={<EditOutlined />} onClick={() => {
                    setIsEditModalOpen(true)
                    setItemId(get(props,'id'))
                }}/>
            )
        },
        {
            title: t("Delete"),
            key: "delete",
            width: 60,
            render: (props) => (
                <Popconfirm
                    title={t("Delete")}
                    description={t("Are you sure to delete?")}
                    onConfirm={() => useDelete(get(props,'id'))}
                    okText={t("Yes")}
                    cancelText={t("No")}
                >
                    <Button danger icon={<DeleteOutlined />}/>
                </Popconfirm>
            )
        },
    ]
    return (
        <Container>
            <Modal
                title={t('Create new currency')}
                open={isCreateModalOpenCreate}
                onCancel={() => setIsCreateModalOpen(false)}
                footer={null}
            >
                <CreateEditCurrency setIsModalOpen={setIsCreateModalOpen}/>
            </Modal>
            <Modal
                title={t("Edit currency")}
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                footer={null}
            >
                <CreateEditCurrency id={itemId} setIsModalOpen={setIsEditModalOpen}/>
            </Modal>

            <Space direction={"vertical"} style={{width: "100%"}} size={"middle"}>
                <Title level={4}>{t("Currency")}</Title>
                <Space size={"middle"}>
                    <Input.Search
                        placeholder={t("Search")}
                        onSearch={(value) => setSearchKey(value)}
                        allowClear
                    />
                    <Button
                        type={"primary"}
                        icon={<PlusOutlined />}
                        onClick={() => setIsCreateModalOpen(true)}
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

export default CurrencyContainer;