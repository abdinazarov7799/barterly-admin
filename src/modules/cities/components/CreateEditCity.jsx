import React, {useEffect} from 'react';
import {useTranslation} from "react-i18next";
import usePostQuery from "../../../hooks/api/usePostQuery.js";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import {Button, Form, Input, Select} from "antd";
import {get} from "lodash";
import usePutQuery from "../../../hooks/api/usePutQuery.js";
import useGetAllQuery from "../../../hooks/api/useGetAllQuery.js";
import useGetOneQuery from "../../../hooks/api/useGetOneQuery.js";


const CreateEditCity = ({id,setIsModalOpen}) => {
    const { t } = useTranslation();
    const [form] = Form.useForm();

    const {data} = useGetOneQuery({
        id,
        key: KEYS.city_get_by_id,
        url: URLS.cities_get_by_id,
        enabled: !!id
    })

    const { mutate, isLoading } = usePostQuery({
        listKeyId: KEYS.cities_list,
    });
    const { mutate:mutateEdit, isLoading:isLoadingEdit } = usePutQuery({
        listKeyId: KEYS.cities_list,
        hideSuccessToast: false
    });

    const {data:regionList,isLoading:isLoadingRegion} = useGetAllQuery({
        key: KEYS.region_list,
        url: URLS.region_list,
    })

    const names = get(data,'data.names') && JSON.parse(get(data,'data.names'));
    useEffect(() => {
        form.setFieldsValue({
            regionId: get(data,'data.regionId'),
            uz: get(names,'uz'),
            ru: get(names,'ru'),
            en: get(names,'en'),
        });
    }, [data]);

    const onFinish = (values) => {
        const formData = {
            regionId: get(values,'regionId'),
            translations: {
                uz: get(values,'uz'),
                ru: get(values,'ru'),
                en: get(values,'en'),
            }
        }
        if (id) {
            mutateEdit(
                { url: `${URLS.cities_edit}/${id}`, attributes: formData },
                {
                    onSuccess: () => {
                        setIsModalOpen(false);
                    },
                }
            );
        }else {
            mutate(
                { url: URLS.cities_add, attributes: formData },
                {
                    onSuccess: () => {
                        setIsModalOpen(false);
                    },
                }
            );
        }
    };

    return (
        <>
            <Form
                onFinish={onFinish}
                autoComplete="off"
                layout={"vertical"}
                form={form}
            >
                <Form.Item
                    label={t("Name uz")}
                    name="uz"
                    rules={[{required: true,}]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label={t("Name ru")}
                    name="ru"
                    rules={[{required: true,}]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label={t("Name en")}
                    name="en"
                    rules={[{required: true,}]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label={t("Region")}
                    name="regionId"
                    rules={[{required: true,}]}
                >
                    <Select
                        loading={isLoadingRegion}
                        placeholder={t("Region")}
                        options={get(regionList,'data.content',[])?.map(item => {
                            return {
                                label: `${get(item,'name')} | ${get(item,'currencyCode')}`,
                                value: get(item,'id')
                            }
                        })}
                    />
                </Form.Item>

                <Form.Item>
                    <Button block type="primary" htmlType="submit" loading={isLoading || isLoadingEdit}>
                        {id ? t("Edit") : t("Create")}
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};


export default CreateEditCity;