import React, {useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import usePostQuery from "../../../hooks/api/usePostQuery.js";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import {Button, Form, Input, message, Upload} from "antd";
import ImgCrop from "antd-img-crop";
import {InboxOutlined} from "@ant-design/icons";
import {get} from "lodash";
import usePutQuery from "../../../hooks/api/usePutQuery.js";
import Resizer from "react-image-file-resizer";
import useGetOneQuery from "../../../hooks/api/useGetOneQuery.js";
const { Dragger } = Upload;


const CreateEditCurrency = ({id,setIsModalOpen}) => {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const [imageUrl,setImgUrl] = useState('');

    const {data} = useGetOneQuery({
        id,
        key: KEYS.currency_get_by_id,
        url: URLS.currency_get_by_id,
        enabled: !!id
    })

    const { mutate, isLoading } = usePostQuery({
        listKeyId: KEYS.currency_list,
    });
    const { mutate:mutateEdit, isLoading:isLoadingEdit } = usePutQuery({
        listKeyId: KEYS.currency_list,
        hideSuccessToast: false
    });
    const { mutate:UploadImage } = usePostQuery({
        hideSuccessToast: true
    });

    useEffect(() => {
        form.setFieldsValue({
            currencyCode: get(data,'data.currencyCode'),
            uz: get(data,'data.translations.uz'),
            ru: get(data,'data.translations.ru'),
            en: get(data,'data.translations.en'),
        });
        setImgUrl(get(data,'data.imageUrl'));
    }, [data]);

    const onFinish = (values) => {
        const formData = {
            currencyCode: get(values,'currencyCode'),
            imageUrl,
            translations: {
                uz: get(values,'uz'),
                ru: get(values,'ru'),
                en: get(values,'en'),
            }
        }
        if (id) {
            mutateEdit(
                { url: `${URLS.currency_edit}/${id}`, attributes: formData },
                {
                    onSuccess: () => {
                        setIsModalOpen(false);
                    },
                }
            );
        }else {
            mutate(
                { url: URLS.currency_add, attributes: formData },
                {
                    onSuccess: () => {
                        setIsModalOpen(false);
                    },
                }
            );
        }
    };

    const resizeFile = (file) => {
        return new Promise((resolve) => {
            Resizer.imageFileResizer(
                file,
                400,
                400,
                "WEBP",
                60,
                0,
                (uri) => {
                    resolve(uri);
                },
                "base64"
            );
        })
    };
    const beforeUpload = async (file) => {
        const isLt2M = file.size / 1024 / 1024 < 10;
        if (!isLt2M) {
            message.error(t('Image must smaller than 10MB!'));
            return;
        }
        const uri = await resizeFile(file);
        const resizedImage = await fetch(uri).then(res => res.blob());
        return new Blob([resizedImage],{ type: "webp"});
    };
    const customRequest = async (options) => {
        const { file, onSuccess, onError } = options;
        const formData = new FormData();
        formData.append('file', file);
        UploadImage(
            { url: URLS.file_upload, attributes: formData, config: { headers: { 'Content-Type': 'multipart/form-data' } } },
            {
                onSuccess: ({ data }) => {
                    onSuccess(true);
                    setImgUrl(data);
                },
                onError: (err) => {
                    onError(err);
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
                    label={t("Currency code")}
                    name="currencyCode"
                    rules={[{required: true,}]}
                >
                    <Input />
                </Form.Item>

                <Form.Item>
                    <ImgCrop quality={0.5} aspect={400/400}>
                        <Dragger
                            maxCount={1}
                            multiple={false}
                            accept={".jpg,.png,jpeg,svg"}
                            customRequest={customRequest}
                            beforeUpload={beforeUpload}
                        >
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">{t("Click or drag file to this area to upload")}</p>
                        </Dragger>
                    </ImgCrop>
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


export default CreateEditCurrency;