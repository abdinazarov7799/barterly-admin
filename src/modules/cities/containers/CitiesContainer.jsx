import React, {useState} from 'react';
import Container from "../../../components/Container.jsx";
import {Button, Input, Modal, Pagination, Popconfirm, Row, Select, Space, Table, Typography} from "antd";
import {get} from "lodash";
import {useTranslation} from "react-i18next";
import usePaginateQuery from "../../../hooks/api/usePaginateQuery.js";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import CreateEditCity from "../components/CreateEditCity.jsx";
import {DeleteOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";
import useDeleteQuery from "../../../hooks/api/useDeleteQuery.js";
import useGetAllQuery from "../../../hooks/api/useGetAllQuery.js";
const { Title } = Typography;

const CitiesContainer = () => {
    const {t} = useTranslation();
    const [page, setPage] = useState(0);
    const [searchKey,setSearchKey] = useState(null);
    const [regionId,setRegionId] = useState(null);
    const [itemId, setItemId] = useState(null);
    const [isCreateModalOpenCreate, setIsCreateModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)

    const {data,isLoading,isFetching} = usePaginateQuery({
        key: KEYS.cities_list,
        url: URLS.cities_list,
        params: {
            params: {
                size: 10,
                regionId,
                search: searchKey
            }
        },
        page
    });

    const {data:regionList,isLoading:isLoadingRegion} = useGetAllQuery({
        key: KEYS.region_list,
        url: URLS.region_list,
    })

    const { mutate } = useDeleteQuery({
        listKeyId: KEYS.cities_list
    });

    const useDelete = (id) => {
        mutate({url: `${URLS.cities_delete}/${id}`})
    }

    const columns = [
        {
            title: "№",
            key: "index",
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
            title: t("Region id"),
            key: "regionId",
            dataIndex: "regionId",
        },
        {
            title: t("Region name"),
            key: "regionName",
            dataIndex: "regionName",
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
                title={t('Create new city')}
                open={isCreateModalOpenCreate}
                onCancel={() => setIsCreateModalOpen(false)}
                footer={null}
            >
                <CreateEditCity setIsModalOpen={setIsCreateModalOpen}/>
            </Modal>
            <Modal
                title={t("Edit city")}
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                footer={null}
            >
                <CreateEditCity id={itemId} setIsModalOpen={setIsEditModalOpen}/>
            </Modal>

            <Space direction={"vertical"} style={{width: "100%"}} size={"middle"}>
                <Title level={4}>{t("Cities")}</Title>
                <Space size={"middle"}>
                    <Input.Search
                        placeholder={t("Search")}
                        onSearch={(value) => setSearchKey(value)}
                        allowClear
                    />
                    <Select
                        loading={isLoadingRegion}
                        allowClear
                        placeholder={t("Region")}
                        onChange={(value) => setRegionId(value)}
                        style={{ width: 200 }}
                        options={get(regionList,'data.content',[])?.map(item => {
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

export default CitiesContainer;
