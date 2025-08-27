import React from 'react';
import { Card } from '../components/ui/card';

const ProductsPage = () => {
  const items = [
    { title: 'Combo Bắp + Nước', desc: 'Tiết kiệm đến 20% khi mua combo.', img: 'https://images.unsplash.com/photo-1532635241-17e820acc59f?w=400&h=250&fit=crop' },
    { title: 'Voucher Quà Tặng', desc: 'Tặng bạn bè vé xem phim tiện lợi.', img: 'https://images.unsplash.com/photo-1511910849309-0dffb70daa1a?w=400&h=250&fit=crop' },
    { title: 'Merch Galaxy', desc: 'Áo thun, cốc nước, móc khoá...', img: 'https://images.unsplash.com/photo-1606167668584-8d46efc2009d?w=400&h=250&fit=crop' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Sản Phẩm</h1>
        <p className="text-gray-600 mb-6">Trang sản phẩm minh hoạ. Tích hợp thanh toán sẽ thực hiện ở giai đoạn sau.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((i, idx) => (
            <Card key={idx} className="overflow-hidden">
              <img src={i.img} alt={i.title} className="w-full h-40 object-cover" />
              <div className="p-4">
                <div className="font-semibold text-lg">{i.title}</div>
                <div className="text-gray-600 text-sm mt-1">{i.desc}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;