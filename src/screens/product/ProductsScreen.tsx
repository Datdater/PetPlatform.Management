import {
  Button,
  Space,
  Tooltip,
  Typography,
  message,
  Card,
  Row,
  Col,
  Image,
  Tag,
  Spin,
  Rate,
} from "antd";
import { useEffect, useState } from "react";
import { colors } from "../../constants/colors";
import { AiOutlinePlus, AiOutlineReload, AiTwotoneEye } from "react-icons/ai";
import { IProduct } from "../../types/IProduct";
import { getProducts } from "../../services/product.service";
import { useNavigate } from "react-router";

const ProductsScreen = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(9);
  const [totalItems, setTotalItems] = useState<number>(0);

  const fetchProducts = async (page: number, pageSize: number) => {
    setLoading(true);
    try {
      const data = await getProducts(page, pageSize);
      setProducts(data.items);
      setTotalItems(data.totalItemsCount);
    } catch (error) {
      message.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleViewProduct = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  useEffect(() => {
    fetchProducts(currentPage, pageSize);
    document.title = "Quản lý Sản phẩm";
  }, [currentPage, pageSize]);

  return (
    <Space
      style={{ width: "100%", padding: "0px 20px" }}
      direction="vertical"
    >
      <Typography style={{ fontSize: 30, marginTop: 20, fontWeight: 600 }}>
        Quản lý Sản phẩm
      </Typography>
      <div
        style={{
          backgroundColor: colors.white,
          width: "100%",
          borderRadius: 10,
          padding: "10px 20px",
          marginTop: 20,
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Space align="center" style={{ width: "100%", marginBottom: 20 }}>
          <h3>Danh sách sản phẩm</h3>
          <div>
            <Button
              type="primary"
              style={{ marginLeft: "auto", marginRight: 10, background: '#d48806', borderColor: '#d48806' }}
              icon={<AiOutlinePlus />}
              onClick={() => navigate("add-product")}
            >
              Thêm sản phẩm
            </Button>
            <Tooltip title="Tải lại">
              <Button
                type="primary"
                shape="circle"
                icon={<AiOutlineReload />}
                onClick={() => fetchProducts(currentPage, pageSize)}
                loading={loading}
                style={{ background: '#d48806', borderColor: '#d48806' }}
              />
            </Tooltip>
          </div>
        </Space>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spin size="large" />
          </div>
        ) : (
          <Row gutter={[16, 16]}>
            {products.map((product) => (
              <Col xs={24} sm={12} md={6} key={product.id}>
                <Card
                  hoverable
                  style={{ cursor: 'pointer', height: 340, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden' }}
                  cover={
                    <Image
                      alt={product.name}
                      src={product.productImage || 'https://via.placeholder.com/300x200'}
                      style={{ height: 160, objectFit: 'cover', borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
                    />
                  }
                  onClick={() => handleViewProduct(product.id)}
                >
                  <Card.Meta
                    title={
                      <>
                        {product.categoryName && (
                          <Tag color="blue" style={{ fontWeight: 600, fontSize: 14, borderRadius: 8, marginBottom: 4, display: 'inline-block' }}>
                            {product.categoryName}
                          </Tag>
                        )}
                        <div style={{ fontWeight: 600, fontSize: 17, minHeight: 32, maxHeight: 32, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</div>
                      </>
                    }
                    description={
                      <Space direction="vertical" size="small">
                        <div>
                          <Typography.Text style={{ color: '#d48806', fontWeight: 700, fontSize: 16 }}>
                            {product.price?.toLocaleString('vi-VN')} VNĐ
                          </Typography.Text>
                        </div>
                        <div>
                          <Rate disabled defaultValue={product.starAverage} style={{ fontSize: 14 }} />
                          <Typography.Text type="secondary" style={{ marginLeft: 8 }}>
                            ({product.reviewCount} đánh giá)
                          </Typography.Text>
                        </div>
                        <div>
                          <Typography.Text type="secondary">
                            Đã bán: {product.sold}
                          </Typography.Text>
                        </div>
                      </Space>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        )}

        <div style={{ marginTop: 20, textAlign: 'center' }}>
          <Button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            style={{ marginRight: 8 }}
          >
            Trang trước
          </Button>
          <Button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage * pageSize >= totalItems}
          >
            Trang sau
          </Button>
        </div>
      </div>
    </Space>
  );
};

export default ProductsScreen;