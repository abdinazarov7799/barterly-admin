import React, {useEffect} from 'react';
import {useTranslation} from "react-i18next";
import usePostQuery from "../../../hooks/api/usePostQuery.js";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import {Button, Form, Input, Select} from "antd";
import {get} from "lodash";
import usePutQuery from "../../../hooks/api/usePutQuery.js";
import useGetOneQuery from "../../../hooks/api/useGetOneQuery.js";
import useGetAllQuery from "../../../hooks/api/useGetAllQuery.js";


const CreateEditCategoryCharacteristicsValue = ({id,setIsModalOpen}) => {
    const { t } = useTranslation();
    const [form] = Form.useForm();

    const {data} = useGetOneQuery({
        id,
        key: KEYS.category_characteristics_get_by_id,
        url: URLS.category_characteristics_get_by_id,
        enabled: !!id
    })

    const { mutate, isLoading } = usePostQuery({
        listKeyId: KEYS.category_characteristics_value_list,
    });

    const { mutate:mutateEdit, isLoading:isLoadingEdit } = usePutQuery({
        listKeyId: KEYS.category_characteristics_value_list,
        hideSuccessToast: false
    });

    const {data:categoryCharacteristicsList,isLoading:isLoadingCategoryCharacteristics} = useGetAllQuery({
        key: KEYS.category_characteristics_list,
        url: URLS.category_characteristics_list,
    })

    useEffect(() => {
        form.setFieldsValue({
            categoryCharacteristicId: get(data,'data.categoryCharacteristicId'),
            uz: get(data,'data.translations.uz'),
            ru: get(data,'data.translations.ru'),
            en: get(data,'data.translations.en'),
        });
    }, [data]);

    const onFinish = (values) => {
        const formData = {
            categoryCharacteristicId: get(values,'categoryCharacteristicId'),
            translations: {
                uz: get(values,'uz'),
                ru: get(values,'ru'),
                en: get(values,'en'),
            }
        }
        if (id) {
            mutateEdit(
                { url: `${URLS.category_characteristics_value_edit}/${id}`, attributes: formData },
                {
                    onSuccess: () => {
                        setIsModalOpen(false);
                    },
                }
            );
        }else {
            mutate(
                { url: URLS.category_characteristics_value_add, attributes: formData },
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
                    label={t("Category characteristics")}
                    name="categoryCharacteristicId"
                    rules={[{required: true,}]}
                >
                    <Select
                        loading={isLoadingCategoryCharacteristics}
                        placeholder={t("Category characteristics")}
                        options={get(categoryCharacteristicsList,'data.content',[])?.map(item => {
                            return {
                                label: `${get(item,'name')} | ${get(item,'parentCharacteristicName')} | ${get(item,'categoryName')}`,
                                value: get(item,'id')
                            }
                        })}
                    />
                </Form.Item>

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

                <Form.Item>
                    <Button block type="primary" htmlType="submit" loading={isLoading || isLoadingEdit}>
                        {id ? t("Edit") : t("Create")}
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};


export default CreateEditCategoryCharacteristicsValue;