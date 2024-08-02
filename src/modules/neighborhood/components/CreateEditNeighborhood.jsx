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


const CreateEditNeighborhood = ({id,setIsModalOpen}) => {
    const { t } = useTranslation();
    const [form] = Form.useForm();

    const {data} = useGetOneQuery({
        id,
        key: KEYS.neighborhood_get_by_id,
        url: URLS.neighborhood_get_by_id,
        enabled: !!id
    })

    const { mutate, isLoading } = usePostQuery({
        listKeyId: KEYS.neighborhood_list,
    });
    const { mutate:mutateEdit, isLoading:isLoadingEdit } = usePutQuery({
        listKeyId: KEYS.neighborhood_list,
        hideSuccessToast: false
    });

    const {data:regionList,isLoading:isLoadingRegion} = useGetAllQuery({
        key: KEYS.region_list,
        url: URLS.region_list,
    })

    const {data:citiesList,isLoading:isLoadingCities} = useGetAllQuery({
        key: KEYS.cities_list,
        url: URLS.cities_list,
    })

    useEffect(() => {
        // form.setFieldsValue({
        //     currencyId: get(itemData,'nameUz'),
        //     uz: get(itemData,'translations.uz'),
        //     ru: get(itemData,'translations.ru'),
        //     en: get(itemData,'translations.en'),
        // });
        // setImgUrl(get(itemData,'imageUrl'));
    }, [data]);

    const onFinish = (values) => {
        const formData = {
            regionId: get(values,'regionId'),
            cityId: get(values,'cityId'),
            translations: {
                uz: get(values,'uz'),
                ru: get(values,'ru'),
                en: get(values,'en'),
            }
        }
        if (id) {
            mutateEdit(
                { url: `${URLS.neighborhood_edit}/${id}`, attributes: formData },
                {
                    onSuccess: () => {
                        setIsModalOpen(false);
                    },
                }
            );
        }else {
            mutate(
                { url: URLS.neighborhood_add, attributes: formData },
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

                <Form.Item
                    label={t("City")}
                    name="cityId"
                    rules={[{required: true,}]}
                >
                    <Select
                        loading={isLoadingCities}
                        placeholder={t("City")}
                        options={get(citiesList,'data.content',[])?.map(item => {
                            return {
                                label: `${get(item,'name')} | ${get(item,'regionName')}`,
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


export default CreateEditNeighborhood;