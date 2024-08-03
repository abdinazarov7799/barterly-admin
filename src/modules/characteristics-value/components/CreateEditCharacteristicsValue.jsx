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


const CreateEditCharacteristicsValue = ({id,setIsModalOpen}) => {
    const { t } = useTranslation();
    const [form] = Form.useForm();

    const {data} = useGetOneQuery({
        id,
        key: KEYS.characteristics_get_by_id,
        url: URLS.characteristics_get_by_id,
        enabled: !!id
    })

    const { mutate, isLoading } = usePostQuery({
        listKeyId: KEYS.characteristics_list,
    });

    const { mutate:mutateEdit, isLoading:isLoadingEdit } = usePutQuery({
        listKeyId: KEYS.characteristics_list,
        hideSuccessToast: false
    });

    const {data:characteristicsList,isLoading:isLoadingCharacteristics} = useGetAllQuery({
        key: KEYS.characteristics_list,
        url: URLS.characteristics_list,
    })

    useEffect(() => {
        form.setFieldsValue({
            characteristicId: get(data,'data.categoryId'),
            uz: get(data,'data.translations.uz'),
            ru: get(data,'data.translations.ru'),
            en: get(data,'data.translations.en'),
        });
    }, [data]);

    const onFinish = (values) => {
        const formData = {
            characteristicId: get(values,'categoryId'),
            translations: {
                uz: get(values,'uz'),
                ru: get(values,'ru'),
                en: get(values,'en'),
            }
        }
        if (id) {
            mutateEdit(
                { url: `${URLS.characteristics_edit}/${id}`, attributes: formData },
                {
                    onSuccess: () => {
                        setIsModalOpen(false);
                    },
                }
            );
        }else {
            mutate(
                { url: URLS.characteristics_add, attributes: formData },
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
                    label={t("Characteristics")}
                    name="characteristicId"
                    rules={[{required: true,}]}
                >
                    <Select
                        loading={isLoadingCharacteristics}
                        placeholder={t("Characteristics")}
                        options={get(characteristicsList,'data.content',[])?.map(item => {
                            return {
                                label: `${get(item,'name')} | ${get(item,'categoryName')}`,
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


export default CreateEditCharacteristicsValue;