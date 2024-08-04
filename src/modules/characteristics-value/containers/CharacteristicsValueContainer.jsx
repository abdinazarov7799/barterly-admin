import React, {useState} from 'react';
import usePaginateQuery from "../../../hooks/api/usePaginateQuery.js";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import {useTranslation} from "react-i18next";
import Container from "../../../components/Container.jsx";
import {Button, Input, Modal, Pagination, Popconfirm, Row, Select, Space, Table, Typography} from "antd";
import {get} from "lodash";
import useDeleteQuery from "../../../hooks/api/useDeleteQuery.js";
import {DeleteOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";
import CreateEditCharacteristicsValue from "../components/CreateEditCharacteristicsValue.jsx";
import useGetAllQuery from "../../../hooks/api/useGetAllQuery.js";
const { Title } = Typography;

const CharacteristicsValueContainer = () => {
    const {t} = useTranslation();
    const [page, setPage] = useState(0);
    const [searchKey,setSearchKey] = useState(null);
    const [itemId, setItemId] = useState(null);
    const [characteristicId, setCharacteristicId] = useState(null);
    const [isCreateModalOpenCreate, setIsCreateModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)

    const {data,isLoading,isFetching} = usePaginateQuery({
        key: KEYS.characteristic_value_list,
        url: URLS.characteristic_value_list,
        params: {
            params: {
                size: 10,
                characteristicId,
                search: searchKey
            }
        },
        page
    });

    const {data:characteristicsList,isLoading:isLoadingCharacteristics} = useGetAllQuery({
        key: KEYS.characteristics_list,
        url: URLS.characteristics_list,
    })

    const { mutate } = useDeleteQuery({
        listKeyId: KEYS.characteristic_value_list
    });

    const useDelete = (id) => {
        mutate({url: `${URLS.characteristic_value_delete}/${id}`})
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
            title: t("Characteristic id"),
            key: "characteristicId",
            dataIndex: "characteristicId",
        },
        {
            title: t("Characteristic name"),
            key: "characteristicName",
            dataIndex: "characteristicName",
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
                title={t('Create new characteristics value')}
                open={isCreateModalOpenCreate}
                onCancel={() => setIsCreateModalOpen(false)}
                footer={null}
            >
                <CreateEditCharacteristicsValue setIsModalOpen={setIsCreateModalOpen}/>
            </Modal>
            <Modal
                title={t("Edit characteristics value")}
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                footer={null}
            >
                <CreateEditCharacteristicsValue id={itemId} setIsModalOpen={setIsEditModalOpen}/>
            </Modal>

            <Space direction={"vertical"} style={{width: "100%"}} size={"middle"}>
                <Title level={4}>{t("Characteristics value")}</Title>
                <Space size={"middle"}>
                    <Input.Search
                        placeholder={t("Search")}
                        onSearch={(value) => setSearchKey(value)}
                        allowClear
                    />
                    <Select
                        loading={isLoadingCharacteristics}
                        allowClear
                        placeholder={t("Characteristics")}
                        onChange={(value) => setCharacteristicId(value)}
                        style={{ width: 200 }}
                        options={get(characteristicsList,'data.content',[])?.map(item => {
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

export default CharacteristicsValueContainer;