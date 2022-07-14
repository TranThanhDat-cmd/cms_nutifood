import './style.scss';

import { Button, Col, Form, Input, InputNumber, Row, Select, Upload } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';

import { UploadOutlined } from '@ant-design/icons';
import { isCheckLoading } from '@helper/isCheckLoading';
import categoryPresenter from '@modules/category/presenter';
import ProductEntity from '@modules/product/entity';
import productPresenter from '@modules/product/presenter';
import shelfPresenter from '@modules/shelf/presenter';
import ButtonForm from '@shared/components/ButtonForm';
import MainTitleComponent from '@shared/components/MainTitleComponent';
import useTable from '@shared/components/TableComponent/hook';
import { useAsync, useSingleAsync } from '@shared/hook/useAsync';
import { useAltaIntl } from '@shared/hook/useTranslate';
import { Editor } from '@tinymce/tinymce-react';
import ViewProductNew from '@view/Product/Component/ViewProductNew';

// import ModalAddImage from '@view/Product/Component/ModalAddImage';
import { routerProduct } from '../../router';
import { routerFormAddProduct, routerFormInfoProduct, routerFormUpdateProduct } from './router';

const params = 'info';

const FormProduct = () => {
  const table = useTable();
  const [form] = Form.useForm();
  const history = useHistory();
  const location = useLocation();
  const { formatMessage } = useAltaIntl();
  const { id } = useParams<{ id: string }>();
  const editorRef: any = useRef(null);
  const [data, setData] = useState<ProductEntity>();

  const [nutritionInfo, setNutritionInfo] = useState<string>('');
  // const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectCategory, setSelectCategory] = useState<any>();
  const [selectShelf, setSelectShelf] = useState<any>();

  const getListCategory = useSingleAsync(categoryPresenter.getListAllCategory);
  const getListShelf = useSingleAsync(shelfPresenter.getAllShelfProduct);
  const { updateProduct, getDetailProduct, createProduct } = productPresenter;
  const [updateProductCall, getDetailProductCall, createProductCall] = useAsync(
    updateProduct,
    getDetailProduct,
    createProduct
  );

  const cutLocation = location.pathname.slice(-4);
  const disabled = cutLocation == params ? true : false;
  const regex = /(\.jpg)$|(\.png)$|(\.jpeg)$/g;

  const idMapping: any = [];
  for (let i = 1; i <= 138; i++) {
    idMapping.push(i);
  }

  useEffect(() => {
    if (!id) return;
    getDetailProductCall.execute(id).then((res: ProductEntity) => {
      form.setFieldsValue(res), setData(res);
    });
  }, []);

  useEffect(() => {
    getListCategory.execute().then((res: any) => {
      const dataCategory = res.data.map(item => {
        return {
          value: item.id,
          label: item.name,
        };
      });
      setSelectCategory(dataCategory);
    });
    getListShelf.execute().then((res: any) => {
      const dataShelf = res.data.map(item => {
        return {
          value: item.id,
          label: item.name,
        };
      });
      setSelectShelf(dataShelf);
    });
  }, []);

  const handleRefresh = () => {
    table.fetchData;
  };

  const onFinish = (value: any) => {
    value.image = value.image.file;
    value.thumbnail = value.thumbnail && value.thumbnail.file;
    const shelfProducts =
      value.shelfId?.length > 0
        ? [
            {
              shelfId: value.shelfId,
              xDirection: value.xDirection || 0,
              yDirection: value.yDirection || 0,
              zDirection: value.preferredProduct || 0,
            },
          ]
        : [];
    delete value.shelfId;
    delete value.xDirection;
    delete value.yDirection;
    delete value.preferredProduct;

    const productRecommends =
      value.productRecommends &&
      value.productRecommends.map((item: string) => {
        return {
          productCategoryId: item,
        };
      });

    const productSuitables =
      value.productSuitables &&
      value.productSuitables.map(item => {
        return {
          idMapping: item,
        };
      });

    const newValue = {
      ...value,
      nutritionInfo,
      shelfProducts,
      productRecommends,
      productSuitables,
    };

    if (id) {
      updateProductCall.execute(id, newValue).then(() => {
        history.push(routerProduct.path);
        handleRefresh();
      });
    } else {
      createProductCall.execute(newValue).then(() => {
        history.push(routerProduct.path);
        handleRefresh();
      });
    }
  };

  const showBreadcrumbs = () => {
    if (!id) {
      return [routerProduct, routerFormAddProduct];
    } else if (id && cutLocation == params) {
      return [routerProduct, routerFormInfoProduct];
    } else {
      return [routerProduct, routerFormUpdateProduct];
    }
  };

  return (
    <div className="form-product">
      <MainTitleComponent breadcrumbs={showBreadcrumbs()} />
      <div className="main-card">
        <Form
          form={form}
          className="main-form"
          layout="vertical"
          name="form-product"
          onFinish={onFinish}
          requiredMark={false}
        >
          <Row justify="space-around">
            <Col span={10}>
              <Form.Item
                name="name"
                label={formatMessage('product.name')}
                rules={[{ required: true }]}
              >
                <Input.TextArea
                  disabled={disabled}
                  autoComplete="off"
                  placeholder={formatMessage('product.name')}
                />
              </Form.Item>
              <Form.Item
                name="productRecommends"
                label={formatMessage('product.ProductRecommends')}
              >
                <Select
                  options={selectCategory}
                  disabled={disabled}
                  placeholder={formatMessage('product.ProductRecommends')}
                  mode="multiple"
                  allowClear
                />
              </Form.Item>
              <Form.Item
                name="shelfId"
                label={formatMessage('product.ShelfProducts')}
                rules={[{ required: true }]}
              >
                <Select
                  options={selectShelf}
                  disabled={disabled}
                  placeholder={formatMessage('product.ShelfProducts')}
                  allowClear
                />
              </Form.Item>
              <Row justify="space-between">
                <Col span={10}>
                  <Form.Item
                    name="xDirection"
                    label={formatMessage('product.xDirection')}
                    rules={[{ required: true }]}
                  >
                    <InputNumber
                      disabled={disabled}
                      autoComplete="off"
                      placeholder={formatMessage('product.xDirection')}
                    />
                  </Form.Item>
                </Col>
                <Col span={10}>
                  <Form.Item
                    name="yDirection"
                    label={formatMessage('product.yDirection')}
                    className="yDirection"
                    rules={[{ required: true }]}
                  >
                    <InputNumber
                      disabled={disabled}
                      autoComplete="off"
                      placeholder={formatMessage('product.yDirection')}
                      name="yDirection"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                name="preferredProduct"
                label={formatMessage('product.preferredProduct')}
                rules={[{ required: true }]}
              >
                <InputNumber
                  disabled={disabled}
                  autoComplete="off"
                  placeholder={formatMessage('product.preferredProduct')}
                />
              </Form.Item>
              <Form.Item name="buyLink" label={formatMessage('product.buyLink')}>
                <Input
                  disabled={disabled}
                  autoComplete="off"
                  placeholder={formatMessage('product.buyLink')}
                />
              </Form.Item>
              <Form.Item name="productSuitables" label={formatMessage('product.ProductSuitables')}>
                <Select
                  disabled={disabled}
                  placeholder={formatMessage('product.ProductSuitables')}
                  mode="multiple"
                  allowClear
                  options={idMapping.map(id => {
                    return {
                      value: id,
                      label: id,
                    };
                  })}
                />
              </Form.Item>
              <Form.Item name="thumbnail" label={formatMessage('product.thumbnail')}>
                <Upload
                  listType="picture"
                  className="avatar-uploader"
                  beforeUpload={() => false}
                  maxCount={1}
                  accept="image/*"
                  disabled={disabled}
                >
                  {data?.thumbnail ? (
                    <img className="product_thumbnail" src={data?.thumbnail} />
                  ) : (
                    <Button icon={<UploadOutlined />}>
                      {formatMessage('product.upload.normal')}
                    </Button>
                  )}
                </Upload>
              </Form.Item>
              <Form.Item
                name="image"
                label={formatMessage('product.image')}
                rules={[{ required: true }]}
              >
                <Upload disabled={disabled} beforeUpload={() => false} maxCount={1} listType="text">
                  <Button icon={<UploadOutlined />}>{formatMessage('product.upload')}</Button>
                </Upload>
              </Form.Item>
              {regex.test(data?.image) ? (
                <img src={data?.image} alt="" className="product_thumbnail" />
              ) : (
                <ViewProductNew url={data?.image} zoomValue={25} speedValue={-5} />
              )}
            </Col>
            <Col span={10}>
              <Form.Item
                valuePropName="nutritionInfo"
                className="form-detail"
                name="nutritionInfo"
                label={formatMessage('product.nutritionInfo')}
                rules={[{ required: true }]}
              >
                <Editor
                  disabled={disabled}
                  apiKey="p0wepyb5vhie1fq4i2f3ok37mdvx2dncg3m1262f1gvkdnqz"
                  onInit={(evt, editor) => (editorRef.current = editor)}
                  initialValue={data?.nutritionInfo || ''}
                  textareaName={formatMessage('product.nutritionInfo')}
                  init={{
                    min_height: 650,
                    plugins: 'table',
                    table_toolbar:
                      'tableprops tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol',
                  }}
                  onEditorChange={(newText: string) => {
                    setNutritionInfo(newText);
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          <ButtonForm
            formName="form-product"
            nameButtonSubmit={id ? 'common.update' : 'common.add'}
            className="my-5"
            isLoading={isCheckLoading([createProductCall, updateProductCall])}
            isDisabled={disabled}
            onCancelForm={() => history.goBack()}
          />
          <div className="note">{formatMessage('product.note')}</div>
        </Form>
        {/* <ModalAddImage
          story={story}
          isModalVisible={isModalVisible}
          setIsModalVisible={setIsModalVisible}
          setStory={setStory}
        /> */}
      </div>
    </div>
  );
};

export default FormProduct;
