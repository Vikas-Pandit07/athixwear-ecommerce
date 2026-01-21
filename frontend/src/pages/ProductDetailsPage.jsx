import React, { useEffect } from "react";

const ProductDetailsPage = ({ productId, stock, onAddToCart}) => {
  const [availableStock, setAvailableStock] = useState(stock);
  const isOutOfStock = availableStock <= 0;

  useEffect(() => {
    fetProductStock();
  }, [productId]);

  const fetProductStock = async () => {
    try {
      const response = await fetch('http://localhost:9090/api/products/${productId}/stock');

      const data = await response.json();

      setAvailableStock(data.stock);
    } catch (err) {
      console.error('Error fetching stock:', err);
    }
  };

  
  return <div>ProductDetailsPage</div>;
};

export default ProductDetailsPage;
