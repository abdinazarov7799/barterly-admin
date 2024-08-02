import React from 'react';
import {URLS} from "../../../constants/url.js";
import {Button, Form, Input, Select} from "antd";
import usePostQuery from "../../../hooks/api/usePostQuery.js";
import {KEYS} from "../../../constants/key.js";
import {useTranslation} from "react-i18next";
import useGetAllQuery from "../../../hooks/api/useGetAllQuery.js";
import {get} from "lodash";

const CreateAdmin = ({setIsModalOpen,refetch}) => {
    const {t} = useTranslation();
    const { mutate, isLoading } = usePostQuery({
        listKeyId: KEYS.admin_list,
    });
    const {data:roleList,isLoading:isLoadingRoleList} = useGetAllQuery({
        key: KEYS.admin_role_list,
        url: URLS.admin_role_list,
    })
    const onFinish = (values) => {
        mutate(
            { url: URLS.admin_add, attributes: values },
            {
                onSuccess: () => {
                    setIsModalOpen(false);
                    refetch()
                },
            }
        );
    };

    return (
        <>
            <Form
                onFinish={onFinish}
                autoComplete="off"
                layout={"vertical"}
            >
                <Form.Item
                    label={t("Email")}
                    name="email"
                    rules={[{required: true,}]}
                >
                    <Input type="email" />
                </Form.Item>

                <Form.Item
                    label={t("User name")}
                    name="username"
                    rules={[{required: true,}]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label={t("Password")}
                    name="password"
                    rules={[{required: true,}]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    label={t("Role")}
                    name="roleId"
                    rules={[{required: true,}]}
                >
                    <Select
                        loading={isLoadingRoleList}
                        placeholder={t("Role")}
                        options={get(roleList,'data',[])?.map(item => {
                            return {
                                label: t(get(item,'name')),
                                value: get(item,'id')
                            }
                        })}
                    />
                </Form.Item>
                <Form.Item>
                    <Button block type="primary" htmlType="submit" loading={isLoading}>
                        {t("Create")}
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default CreateAdmin;