import React, {useState} from 'react';
import usePaginateQuery from "../../../hooks/api/usePaginateQuery.js";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import {useTranslation} from "react-i18next";
import Container from "../../../components/Container.jsx";
import {Button, Checkbox, Input, Modal, Pagination, Popconfirm, Row, Space, Table, Typography} from "antd";
import {get} from "lodash";
import {DeleteOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";
import CreateEditCharacteristics from "../components/CreateEditCharacteristics.jsx";
import useDeleteQuery from "../../../hooks/api/useDeleteQuery.js";
const { Title } = Typography;

const CharacteristicsContainer = () => {
    const {t} = useTranslation();
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [searchKey,setSearchKey] = useState();
    const [itemId, setItemId] = useState(null);
    const [isCreateModalOpenCreate, setIsCreateModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)

    const {data,isLoading,isFetching} = usePaginateQuery({
        key: KEYS.characteristics_list,
        url: URLS.characteristics_list,
        params: {
            params: {
                size,
                search: searchKey
            }
        },
        page
    });

    const { mutate } = useDeleteQuery({
        listKeyId: KEYS.characteristics_list
    });

    const useDelete = (id) => {
        mutate({url: `${URLS.characteristics_delete}/${id}`})
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
            title: t("Category id"),
            key: "categoryId",
            dataIndex: "categoryId",
        },
        {
            title: t("Category name"),
            key: "categoryName",
            dataIndex: "categoryName",
        },
        {
            title: t("Required"),
            key: "required",
            dataIndex: "required",
            render: (data) => <Checkbox value={data} disabled/>
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
                title={t('Create new characteristics')}
                open={isCreateModalOpenCreate}
                onCancel={() => setIsCreateModalOpen(false)}
                footer={null}
            >
                <CreateEditCharacteristics setIsModalOpen={setIsCreateModalOpen}/>
            </Modal>
            <Modal
                title={t("Edit characteristics")}
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                footer={null}
            >
                <CreateEditCharacteristics id={itemId} setIsModalOpen={setIsEditModalOpen}/>
            </Modal>

            <Space direction={"vertical"} style={{width: "100%"}} size={"middle"}>
                <Title level={4}>{t("Characteristics")}</Title>
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

export default CharacteristicsContainer;