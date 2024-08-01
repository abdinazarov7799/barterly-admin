import React, {useState} from 'react';
import usePaginateQuery from "../../../hooks/api/usePaginateQuery.js";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import {useTranslation} from "react-i18next";
import Container from "../../../components/Container.jsx";
import {Input, Pagination, Row, Space, Table} from "antd";
import {get} from "lodash";

const RegionContainer = () => {
    const {t} = useTranslation();
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [searchKey,setSearchKey] = useState();
    const {data,isLoading,isFetching} = usePaginateQuery({
        key: KEYS.region_list,
        url: URLS.region_list,
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
    ]
    return (
        <Container>
            <Space direction={"vertical"} style={{width: "100%"}} size={"middle"}>
                <Space size={"middle"}>
                    <Input.Search
                        placeholder={t("Search")}
                        onChange={(e) => setSearchKey(e.target.value)}
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

export default RegionContainer;