'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load product data from localStorage
    const loadProduct = () => {
      try {
        const productList = JSON.parse(localStorage.getItem('productList') || '[]');
        const foundProduct = productList.find((p: Product) => p.KODE_PART === params.id);
        
        if (foundProduct) {
          setProduct(foundProduct);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error loading product:', error);
        setLoading(false);
      }
    };

    loadProduct();
  }, [params.id]);

  if (loading) {
    return (
      <div className="container mx-auto py-10 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Memuat data produk...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto py-10">
        <Button 
          variant="ghost" 
          onClick={() => router.push('/products')}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Kembali ke Daftar Produk
        </Button>
        <div className="bg-muted p-6 rounded-md text-center">
          <h1 className="text-xl font-semibold mb-4">Produk tidak ditemukan</h1>
          <p>Produk dengan kode {params.id} tidak tersedia.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center-safe item-center py-10 mx-10">
        <div className="container mx-auto py-10">
        <Button 
            variant="ghost" 
            onClick={() => router.push('/products')}
            className="mb-6 flex items-center gap-2"
        >
            <ArrowLeft size={16} />
            Kembali ke Daftar Produk
        </Button>

        <div className="bg-card rounded-lg shadow-sm p-6">
            <div className="border-b pb-4 mb-6">
            <h1 className="text-3xl font-bold">{product.NAMA_PART}</h1>
            <div className="flex gap-4 mt-2">
                <span className="text-muted-foreground">Kode: {product.KODE_PART}</span>
                <span className="text-muted-foreground">No. Part: {product.No_PART}</span>
            </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
                <div>
                <h2 className="text-lg font-semibold mb-3">Spesifikasi</h2>
                <div className="space-y-2">
                    <div className="flex justify-between border-b border-muted pb-2">
                    <span className="text-muted-foreground">Spesifikasi</span>
                    <span className="font-medium">{product.SPEC}</span>
                    </div>
                    <div className="flex justify-between border-b border-muted pb-2">
                    <span className="text-muted-foreground">Tebal</span>
                    <span className="font-medium">{product.TEBAL} mm</span>
                    </div>
                    <div className="flex justify-between border-b border-muted pb-2">
                    <span className="text-muted-foreground">Material Type</span>
                    <span className="font-medium">{product.TYPE_MTRL}</span>
                    </div>
                    <div className="flex justify-between border-b border-muted pb-2">
                    <span className="text-muted-foreground">Toleransi</span>
                    <span className="font-medium">{product.TOL}</span>
                    </div>
                </div>
                </div>

                <div>
                <h2 className="text-lg font-semibold mb-3">Dimensi Sheet</h2>
                <div className="space-y-2">
                    <div className="flex justify-between border-b border-muted pb-2">
                    <span className="text-muted-foreground">Panjang Sheet</span>
                    <span className="font-medium">{product.PNJANG_SHEET} mm</span>
                    </div>
                    <div className="flex justify-between border-b border-muted pb-2">
                    <span className="text-muted-foreground">Lebar Sheet</span>
                    <span className="font-medium">{product.LEBAR_SHEET} mm</span>
                    </div>
                    <div className="flex justify-between border-b border-muted pb-2">
                    <span className="text-muted-foreground">Lebar Shearing</span>
                    <span className="font-medium">{product.LEBAR_SHEARG} mm</span>
                    </div>
                </div>
                </div>
            </div>

            <div className="space-y-6">
                <div>
                <h2 className="text-lg font-semibold mb-3">Produksi</h2>
                <div className="space-y-2">
                    <div className="flex justify-between border-b border-muted pb-2">
                    <span className="text-muted-foreground">Langkah Pitch</span>
                    <span className="font-medium">{product.LANGKAH_PITCH}</span>
                    </div>
                    <div className="flex justify-between border-b border-muted pb-2">
                    <span className="text-muted-foreground">Langkah Cavity</span>
                    <span className="font-medium">{product.LANGKAH_CAV}</span>
                    </div>
                    <div className="flex justify-between border-b border-muted pb-2">
                    <span className="text-muted-foreground">PCS per Lembar</span>
                    <span className="font-medium">{product.JUMLAH_PCS_PER_LBR} pcs</span>
                    </div>
                    <div className="flex justify-between border-b border-muted pb-2">
                    <span className="text-muted-foreground">Berat per Lembar</span>
                    <span className="font-medium">{product.BERAT_per_LEMBAR} kg</span>
                    </div>
                </div>
                </div>

                <div>
                <h2 className="text-lg font-semibold mb-3">Rajangan</h2>
                <div className="space-y-2">
                    <div className="flex justify-between border-b border-muted pb-2">
                    <span className="text-muted-foreground">Rajangan per Lembar</span>
                    <span className="font-medium">{product.JUMLAH_Rjg_per_Lbr}</span>
                    </div>
                    <div className="flex justify-between border-b border-muted pb-2">
                    <span className="text-muted-foreground">PCS per Rajangan</span>
                    <span className="font-medium">{product.JUMLAH_Pcs_per_Rjg} pcs</span>
                    </div>
                    <div className="flex justify-between border-b border-muted pb-2">
                    <span className="text-muted-foreground">Berat per Rajangan</span>
                    <span className="font-medium">{product.BERAT_per_RAJANG} kg</span>
                    </div>
                    <div className="flex justify-between border-b border-muted pb-2">
                    <span className="text-muted-foreground">BRUTTO</span>
                    <span className="font-medium">{product.BRUTTO}</span>
                    </div>
                    <div className="flex justify-between border-b border-muted pb-2">
                    <span className="text-muted-foreground">PCS per KG</span>
                    <span className="font-medium">{product.pcs_per_kg}</span>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
        </div>
    </div>
  );
}