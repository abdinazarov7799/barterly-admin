import React, {useState} from 'react';
import usePaginateQuery from "../../../hooks/api/usePaginateQuery.js";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import {useTranslation} from "react-i18next";
import Container from "../../../components/Container.jsx";
import {Button, Image, Input, Modal, Pagination, Popconfirm, Row, Select, Space, Table, Typography} from "antd";
import {get} from "lodash";
import CreateEditRegion from "../components/CreateEditRegion.jsx";
import {DeleteOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";
import useDeleteQuery from "../../../hooks/api/useDeleteQuery.js";
import useGetAllQuery from "../../../hooks/api/useGetAllQuery.js";
const { Title } = Typography;

const RegionContainer = () => {
    const {t} = useTranslation();
    const [page, setPage] = useState(0);
    const [searchKey,setSearchKey] = useState(null);
    const [currencyId,setCurrencyId] = useState(null);
    const [itemId, setItemId] = useState(null);
    const [isCreateModalOpenCreate, setIsCreateModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)

    const {data,isLoading,isFetching} = usePaginateQuery({
        key: KEYS.region_list,
        url: URLS.region_list,
        params: {
            params: {
                size: 10,
                currencyId,
                search: searchKey
            }
        },
        page
    });

    const {data:currencyList,isLoading:isLoadingCurrency} = useGetAllQuery({
        key: KEYS.currency_list,
        url: URLS.currency_list,
    })

    const { mutate } = useDeleteQuery({
        listKeyId: KEYS.region_list
    });

    const useDelete = (id) => {
        mutate({url: `${URLS.region_delete}/${id}`})
    }

    const columns = [
        {
            title: "№",
            key: "index",
            width: 40,
            render: (props, data, index) => index + 1
        },
        {
            title: t("ID"),
            key: "id",
            dataIndex: "id",
        },
        {
            title: t("Name"),
            key: "name",
            dataIndex: "name",
        },
        {
            title: t("Currency id"),
            key: "currencyId",
            dataIndex: "currencyId",
        },
        {
            title: t("Currency code"),
            key: "currencyCode",
            dataIndex: "currencyCode",
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
                title={t('Create new region')}
                open={isCreateModalOpenCreate}
                onCancel={() => setIsCreateModalOpen(false)}
                footer={null}
            >
                <CreateEditRegion setIsModalOpen={setIsCreateModalOpen}/>
            </Modal>
            <Modal
                title={t("Edit region")}
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                footer={null}
            >
                <CreateEditRegion id={itemId} setIsModalOpen={setIsEditModalOpen}/>
            </Modal>
            <Space direction={"vertical"} style={{width: "100%"}} size={"middle"}>
                <Title level={4}>{t("Regions")}</Title>
                <Space size={"middle"}>
                    <Input.Search
                        placeholder={t("Search")}
                        onSearch={(value) => setSearchKey(value)}
                        allowClear
                    />
                    <Select
                        loading={isLoadingCurrency}
                        allowClear
                        placeholder={t("Currency")}
                        onChange={(value) => setCurrencyId(value)}
                        style={{ width: 200 }}
                        options={get(currencyList,'data.content',[])?.map(item => {
                            return {
                                label: `${get(item,'name')} | ${get(item,'currencyCode')}`,
                                value: get(item,'id')
                            }
                        })}
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

export default RegionContainer;