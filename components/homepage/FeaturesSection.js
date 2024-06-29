import { FaQrcode, FaShoppingCart, FaInstagram, FaLanguage, FaPalette, FaImage } from 'react-icons/fa';

const FeaturesSection = () => {
  return (
    <section className="bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-brandOrange text-lg font-semibold mb-4">Features</h2>
        <h2 className="text-3xl font-bold text-center text-brandBlack mb-8">A full range of features available with just one click</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="text-center">
            <FaQrcode className="mx-auto text-brandOrange text-6xl mb-4" />
            <h3 className="text-xl font-semibold">Smart QR Code</h3>
            <p className="text-gray-600">One unique QR code to access all your menus</p>
          </div>
          <div className="text-center">
            <FaShoppingCart className="mx-auto text-brandOrange text-6xl mb-4" />
            <h3 className="text-xl font-semibold">Pre-Select</h3>
            <p className="text-gray-600">Let customers pre-select their order directly from their smartphone</p>
          </div>
          <div className="text-center">
            <FaInstagram className="mx-auto text-brandOrange text-6xl mb-4" />
            <h3 className="text-xl font-semibold">Logo & SNS</h3>
            <p className="text-gray-600">Add your business logo and SNS</p>
          </div>
          <div className="text-center">
            <FaLanguage className="mx-auto text-brandOrange text-6xl mb-4" />
            <h3 className="text-xl font-semibold">Translations</h3>
            <p className="text-gray-600">Multiple languages available for your menu</p>
            <span className="text-sm text-purple-500">Coming Soon</span>
          </div>
          <div className="text-center">
            <FaPalette className="mx-auto text-brandOrange text-6xl mb-4" />
            <h3 className="text-xl font-semibold">Color customization</h3>
            <p className="text-gray-600">Choose your colors and customize your menu as you wish</p>
            <span className="text-sm text-purple-500">Coming Soon</span>
          </div>
          <div className="text-center">
            <FaImage className="mx-auto text-brandOrangetext-6xl mb-4" />
            <h3 className="text-xxl font-semibold">Enhanced products</h3>
            <p className="text-gray-600">Add pictures, special diets, and even spiciness to all your products</p>
            <span className="text-sm text-purple-500">Coming Soon</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
