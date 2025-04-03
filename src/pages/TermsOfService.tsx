
import { Separator } from "@/components/ui/separator";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TermsOfService = () => {
  const navigate = useNavigate();
  
  const handleReturnToMain = () => {
    navigate('/');
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        {/* Add extra padding at the top to create more space below the navbar */}
        <div className="pt-16 md:pt-20"></div>
        
        {/* Close button to return to main page */}
        <div className="fixed top-24 right-6 z-40">
          <Button 
            onClick={handleReturnToMain}
            size="sm"
            variant="outline"
            className="rounded-full shadow-md hover:shadow-lg bg-white/90 backdrop-blur-sm"
          >
            <X className="h-4 w-4 mr-1" /> Close
          </Button>
        </div>
        
        <h1 className="text-3xl font-bold mb-6 text-center">Terms of Service</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 mb-8">
            Welcome to FitAnywhere. Please carefully read the following Terms of Service ("TOS") before using our website or making any purchases. 
            By placing an order on our website or via email, you agree to comply with these terms. These terms do not affect your statutory rights.
          </p>
          
          <p className="text-gray-700 mb-8">
            We reserve the right to modify these Terms of Service at any time without prior notice. 
            Changes become effective immediately upon publication. Each time you place an order, 
            it is your responsibility to review and agree to the latest version of our Terms of Service.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. COMPANY INFORMATION</h2>
          <p className="text-gray-700 mb-4">This website is owned and operated by:</p>
          <p className="text-gray-700 mb-4">FitAnywhere<br />Email: be@fitanywhere.today</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">2. ORDER PROCESSING & ACCEPTANCE</h2>
          <p className="text-gray-700 mb-2">2.1 Order Placement – Orders can be placed online through our secure checkout process or by emailing be@fitanywhere.today.</p>
          <p className="text-gray-700 mb-2">2.2 Order Confirmation – You will receive an email confirming your order details within 24 hours or the next business day.</p>
          <p className="text-gray-700 mb-6">2.3 Order Acceptance – Your order represents an offer to purchase goods, and acceptance occurs only upon shipment. We reserve the right to reject an order due to product availability, pricing errors, inability to authorize payment, or other circumstances at our sole discretion.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">3. PRODUCTS OFFERED</h2>
          <p className="text-gray-700 mb-2">FitAnywhere Bundle: Includes PowerTower, TRX, and Bands.</p>
          <p className="text-gray-700 mb-6">BoxFun: Available separately.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">4. PAYMENT</h2>
          <p className="text-gray-700 mb-2">4.1 Payment Terms – Payments must be made at the time of order placement. We accept payments via major credit cards and online payment gateways.</p>
          <p className="text-gray-700 mb-6">4.2 Pricing & Taxes – Prices include VAT within the EU. For customers outside the EU, VAT will not be charged. In case of pricing errors, you will be notified immediately and given the option to reconfirm or cancel your order.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">5. DELIVERY & SHIPPING</h2>
          <p className="text-gray-700 mb-2">5.1 Shipping Address – Goods will be shipped to the address provided at the time of order placement.</p>
          <p className="text-gray-700 mb-2">5.2 Delivery Confirmation – A signature is required upon delivery. Do not accept visibly damaged packages without noting damage clearly upon receipt.</p>
          <p className="text-gray-700 mb-2">5.3 Delivery Schedule – Orders are typically dispatched within 5 working days. We do not guarantee specific delivery dates and are not liable for delays beyond our control.</p>
          <p className="text-gray-700 mb-6">5.4 Shipping Risks – FitAnywhere assumes responsibility for goods until they are signed for upon delivery. Notify us immediately of lost or damaged goods by email.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">6. RETURNS, CANCELLATIONS & REFUNDS</h2>
          <p className="text-gray-700 mb-2">6.1 Cancellation & Returns – You may cancel or return orders within 14 days of delivery. Items must be unused, in original packaging, and returned at your expense unless faulty.</p>
          <p className="text-gray-700 mb-2">6.2 Faulty Goods – Report damaged or faulty items within 3 business days after delivery. Provide photographic evidence via email to arrange replacements or refunds.</p>
          <p className="text-gray-700 mb-6">6.3 Refunds – Refunds for returned items will be processed within 10 business days of receiving the item back. Initial shipping charges and return shipping costs are non-refundable unless items are faulty within the EU.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">7. WARRANTIES & LIABILITY</h2>
          <p className="text-gray-700 mb-2">7.1 Limited Warranty – Products are covered by a 1-year warranty against manufacturing defects.</p>
          <p className="text-gray-700 mb-6">7.2 Liability – FitAnywhere is not liable for incidental, indirect, or consequential damages arising from product use or delivery delays.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">8. PRIVACY & DATA PROTECTION</h2>
          <p className="text-gray-700 mb-2">8.1 Data Collection & Use – We collect essential data (name, address, email, phone number) solely for order fulfillment and customer service. Payment information is processed securely and never stored on our servers.</p>
          <p className="text-gray-700 mb-2">8.2 Cookies & Analytics – Our website uses cookies for functionality and Google Analytics to improve user experience. Users may disable cookies in their browser settings.</p>
          <p className="text-gray-700 mb-6">8.3 Marketing Communications – You may opt into marketing communications, and you can unsubscribe anytime using links provided in emails.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">9. INTELLECTUAL PROPERTY</h2>
          <p className="text-gray-700 mb-6">9.1 Ownership & Use – All content, branding, and product designs remain the exclusive property of FitAnywhere and cannot be reproduced without express written permission.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">10. GENERAL CONDITIONS</h2>
          <p className="text-gray-700 mb-2">10.1 User Responsibilities – Customers must ensure accurate information for shipping and payments. FitAnywhere will not be responsible for incorrect addresses or payment details.</p>
          <p className="text-gray-700 mb-6">10.2 Governing Law – These terms shall be governed by applicable Slovenian and EU law.</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">11. CONTACT INFORMATION</h2>
          <p className="text-gray-700 mb-6">
            For inquiries, support, or privacy concerns, contact us:<br />
            Email: be@fitanywhere.today
          </p>
          
          <Separator className="my-8" />
          
          <p className="text-gray-700 mb-8">
            By using our website and purchasing our products, you confirm that you have read, understood, and agree to these Terms of Service.
          </p>
          
          {/* Fixed Position "Return to Main Page" Button for mobile */}
          <div className="md:hidden fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
            <Button 
              onClick={handleReturnToMain}
              size="lg"
              className="rounded-full shadow-lg bg-yellow text-black font-bold"
            >
              Return to Main Page
            </Button>
          </div>
          
          {/* Added spacing at bottom for mobile */}
          <div className="h-24 md:hidden"></div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;
