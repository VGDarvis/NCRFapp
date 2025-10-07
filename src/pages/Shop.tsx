import { CategoryCard } from "@/components/shop/CategoryCard";
import { Home, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

const categories = [
  {
    id: "hbcu",
    name: "HBCU Products",
    description: "HBCUs MATTER - Show your pride",
    image: "/src/assets/shop/black-shirt-1.png",
    color: "from-amber-500 to-yellow-600"
  },
  {
    id: "ncrf",
    name: "NCRF Products",
    description: "National College Resources Foundation gear",
    image: "/src/assets/shop/ncrf-black-shirt.png",
    color: "from-green-500 to-emerald-600"
  },
  {
    id: "bce",
    name: "BCE Products",
    description: "Black College Expo apparel",
    image: "/src/assets/shop/bce-black-shirt.png",
    color: "from-green-600 to-teal-700"
  },
  {
    id: "latino",
    name: "LATINO Products",
    description: "Latino College Expo merchandise",
    image: "/src/assets/shop/red-shirt.png",
    color: "from-red-500 to-rose-600"
  },
  {
    id: "sap",
    name: "SAP Products",
    description: "Student Athlete Program gear",
    image: "/src/assets/shop/grey-shirt.png",
    color: "from-blue-500 to-indigo-600"
  },
  {
    id: "steam",
    name: "STEAM Products",
    description: "STEAM program apparel",
    image: "/src/assets/shop/steam-black-shirt.png",
    color: "from-purple-500 to-violet-600"
  }
];

export default function Shop() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-40 glass-dark border-b border-gray-800/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
              aria-label="Go to home"
            >
              <Home className="h-5 w-5" />
              <span className="hidden sm:inline">Home</span>
            </button>
            <div className="hidden sm:flex items-center">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <button onClick={() => navigate("/")} className="text-gray-400 hover:text-white transition-colors">
                      Home
                    </button>
                  </BreadcrumbItem>
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-white">Shop</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-6 w-6 text-primary" />
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Shop
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Premium <span className="text-primary">College Prep</span> Merchandise
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Show your pride with high-quality apparel from our programs. Free shipping on orders over $50!
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <button
            onClick={() => navigate("/shop/category/all")}
            className="btn-gold px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
          >
            View All Products
          </button>
        </div>
      </div>
    </div>
  );
}
