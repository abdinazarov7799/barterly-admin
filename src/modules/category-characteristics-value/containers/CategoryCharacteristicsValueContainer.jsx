import React, {useState} from 'react';
import usePaginateQuery from "../../../hooks/api/usePaginateQuery.js";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import {useTranslation} from "react-i18next";
import Container from "../../../components/Container.jsx";
import {Button, Input, Modal, Pagination, Popconfirm, Row, Select, Space, Table, Typography} from "antd";
import {get} from "lodash";
import {DeleteOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";
import useDeleteQuery from "../../../hooks/api/useDeleteQuery.js";
import CreateEditCategoryCharacteristicsValue from "../components/CreateEditCategoryCharacteristicsValue.jsx";
import useGetAllQuery from "../../../hooks/api/useGetAllQuery.js";
const { Title } = Typography;

const CategoryCharacteristicsValueContainer = () => {
    const {t} = useTranslation();
    const [page, setPage] = useState(0);
    const [searchKey,setSearchKey] = useState(null);
    const [itemId, setItemId] = useState(null);
    const [categoryCharacteristicId, setCategoryCharacteristicId] = useState(null);
    const [isCreateModalOpenCreate, setIsCreateModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)

    const {data,isLoading,isFetching} = usePaginateQuery({
        key: KEYS.category_characteristics_value_list,
        url: URLS.category_characteristics_value_list,
        params: {
            params: {
                size: 10,
                categoryCharacteristicId,
                search: searchKey
            }
        },
        page
    });

    const {data:categoryCharacteristicsList,isLoading:isLoadingCategoryCharacteristics} = useGetAllQuery({
        key: KEYS.category_characteristics_list,
        url: URLS.category_characteristics_list,
    })

    const { mutate } = useDeleteQuery({
        listKeyId: KEYS.category_characteristics_value_list
    });

    const useDelete = (id) => {
        mutate({url: `${URLS.category_characteristics_value_delete}/${id}`})
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
            title: t("Category characteristic id"),
            key: "categoryCharacteristicId",
            dataIndex: "categoryCharacteristicId",
        },
        {
            title: t("Category characteristic name"),
            key: "categoryCharacteristicName",
            dataIndex: "categoryCharacteristicName",
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
                title={t('Create new category characteristics value')}
                open={isCreateModalOpenCreate}
                onCancel={() => setIsCreateModalOpen(false)}
                footer={null}
            >
                <CreateEditCategoryCharacteristicsValue setIsModalOpen={setIsCreateModalOpen}/>
            </Modal>
            <Modal
                title={t("Edit category characteristics value")}
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                footer={null}
            >
                <CreateEditCategoryCharacteristicsValue id={itemId} setIsModalOpen={setIsEditModalOpen}/>
            </Modal>

            <Space direction={"vertical"} style={{width: "100%"}} size={"middle"}>
                <Title level={4}>{t("Category characteristics value")}</Title>
                <Space size={"middle"}>
                    <Input.Search
                        placeholder={t("Search")}
                        onSearch={(value) => setSearchKey(value)}
                        allowClear
                    />
                    <Select
                        loading={isLoadingCategoryCharacteristics}
                        allowClear
                        placeholder={t("Category characteristics")}
                        onChange={(value) => setCategoryCharacteristicId(value)}
                        style={{ width: 200 }}
                        options={get(categoryCharacteristicsList,'data.content',[])?.map(item => {
                            return {
                                label: get(item,'name'),
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

export default CategoryCharacteristicsValueContainer;