import { useNavigate } from "react-router-dom";

// src/pages/vendor/VendorTOSAcceptance.jsx
const tosContent = [
  {
    title: "I. Representations",
    list: [
      "You/ Vendor shall create a Vendor Account on locarto.",
      "You will provide honest, accurate information to the Site and in your ‘About’ category.",
      "You will follow all the Site’s policies.",
      "You shall ensure your content, such as any text, photos or videos used to represent yourself, your shop or your listings, abide by the Site’s policies and applicable laws.",
      "You shall accurately represent your items in listings and listing photos.",
      "You shall respect the intellectual property of others. If you feel someone has violated your intellectual property rights, you shall lodge a complaint with the Site.",
      "All handmade items are made or designed by you. If you work with a production partner, you must disclose that production partner in your relevant listings.",
      "You are using your own photographs or video content – not stock photos, artistic renderings, or photos used by other Vendors or sites. You shall provide your high-resolution logo with images of your products in cdr/jpeg format.",
      "All listings are available for purchase at a set price and discounts may be offered by you on the same.",
      "If you are using photographs of previous work with options for customisation (like colour choices) included in the listing, you must be clear in your description that the photos shown are just examples.",
      "You shall ensure that the description of listing has to be accurate.",
    ],
    subSection: {
      title: "Product Labelling and Information",
      text: "Your products shall hold labels and provide information as mandated under applicable laws (including the The Legal Metrology (Packaged Commodities) Rules, 2011 and its amendments). On each of your products sold you shall declare:",
      list: [
        "Name and address of the manufacturer and packer.",
        "Common or generic names of the commodity in the package.",
        "Net quantity (in standard unit of weight or measure).",
        "Month and year of manufacture or packing.",
        "Retail sale price of the package.",
        "Dimensions of the commodity, if relevant.",
      ],
    },
  },
  {
    title: "II. Restrictions on the Vendor",
    list: [
      "Prohibited products, services and items that violate our intellectual property policies are not allowed to be sold on the Site. Such prohibited products shall include but not be limited to:",
      "All listings must offer an item for sale (which includes digitally delivered items, and can also include reserved listings). You may not create a Site listing for the purpose of sharing a referral code, posting a want ad, or similar activity that does not offer a physical or digital item for sale.",
      "Reselling is not allowed on the Site and Locarto shall not accept brands that are willing to do so. Reselling refers to listing an item as handmade when you were not involved in designing, marketing or making that item.",
      "Users or third parties may flag listings that appear to violate of the Site’s policies for our review. We may remove any listings that violate our policies. Please note that listing fees are non-refundable. We may also suspend or terminate your account for any violations and you'll still have to pay any outstanding fees to the Site.",
      "You shall not facilitate off-platform transactions.",
      "You shall not create duplicate accounts and vendor pages or take any other action (such as manipulating clicks, carts or sales) for the purpose of shilling, manipulating search or circumventing the Site's policies.",
      "You shall not coordinate pricing with other Vendors.",
    ],
  },
  {
    title: "III. Logistic Services",
    text: "You may avail logistics services from any of the below options: Our Logistics Services.",
    list: [],
  },
  {
    title: "IV. Commission and Payment Schedule",
    text: "Commission to be charged and Payment Schedule shall be in the manner as provided in Annexure “1” hereto. Vendors may be charged for using some of our services. There are fees associated with listing, selling, advertising, and certain other products and features on the Site. The same shall be as per the Site’s Policies.",
    list: [],
  },
  {
    title: "V. Delivery",
    text: "If you opt for our logistics services, you agree to have the item purchased by a buyer picked up from your place of business as per the Delivery rates provided in Annexure 1. In the event you have signed up for our delivery service, you agree to be bound by the applicable terms and policies for delivery.",
    list: [],
  },
  {
    title: "VI. Lock-in Period",
    text: "You shall not be entitled to terminate this Form for a period of 1 month from the date of execution hereof.",
    list: [],
  },
  {
    title: "VII. Term",
    text: "This Form shall commence from the date of execution hereof and shall remain in force till termination. Subject to the lock-in period you may terminate this Form by giving us written notice of atleast 30 (sixty) days.",
    list: [],
  },
  {
    title: "VIII. Exclusivity",
    text: "In the event you sell your products/ items exclusively on our website, you may be entitled to additional benefits as highlighted by our commissions milestones.",
    list: [],
  },
  {
    title: "IX. Liquidated damages",
    text: "In the event of you terminating this Form during the lock-in period or in the event of any breach of your obligations under this Form you shall be liable to pay liquidated damages amounting to Rs. ___.",
    list: [],
  },
  {
    title: "X. Taxes",
    text: "All amounts payable herein shall be exclusive of applicable taxes, which shall be payable by you.",
    list: [],
  },
  {
    title: "XI. Payment Settlement Process:",
    text: "We shall transfer, the order value received, to the you after deduction of the following amounts, as applicable: I. Commission; II. Payment Mechanism Fee; III. Cancellation Fee; IV. Pickup/ Delivery Commission; V. Contribution towards Discount and; VI. Any other amounts, charges that are due to us. The Parties acknowledge and agree that after the deduction of the aforementioned amounts, we shall remit the order value due to you:",
    subSection: {
      title: "Payment Settlement Day",
      text: "On a weekly basis, after allowing reasonable time for adjustments towards orders for which the buyers have either refused to pay or have claimed a refund, as applicable (but in accordance with the guidelines prescribed by Reserve Bank of India for payment systems and nodal account).",
    },
    list: [],
  },
  {
    title: "XII. Terms of Use and Privacy Policy",
    text: "You shall abide by the Terms of Use and Privacy Policy of the Site along with all other policies as applicable to you for using the Site.",
    list: [],
  },
  {
    title: "XIII. Vendor Standards",
    text: "By listing a product for sale on the Site you understand and agree that you are responsible for complying with all applicable laws and regulations for the products you list for sale, including any required labels and warnings. The Site assumes no responsibility for the accuracy, labelling, or content of your listings. As a Vendor, you must provide good customer service and maintain trust with your buyers. We may reach out to you if you fail to meet the Site’s standards. By selling on the Site, you agree to:",
    list: [
      "Honour your dispatch and processing times. You are obligated to dispatch an item or otherwise complete a transaction with a buyer in a prompt manner and within the timelines displayed by you on the Site, unless there is an exceptional circumstance.",
      "Respond to User messages in a timely manner.",
      "Honour the commitments you make in your display page on the Site.",
      "Resolve disagreements or order issues directly with the buyer. In the unlikely event that you can’t reach a resolution, we may assist you.",
      "If you are unable to complete an order, you must notify the buyer and cancel the order as per the Site’s policies.",
    ],
  },
  {
    title: "XIV. Safeguard data",
    text: "You have the responsibility to safeguard personal information and communicate promptly with buyers in order to provide a great customer experience.",
    list: [],
  },
  {
    title: "XV. Creating and Uploading Content",
    text: "You may create and upload a variety of content, like listings, messages, text, photos, documents and videos. In order to keep our community safe and respectful, you agree that you will not upload content that:",
    list: [
      "Contains hateful or derogatory language or imagery, or any content that is contrary to our policies;",
      "Contains threats, harassment, extortion, or violates our rules about interference;",
      "Violates someone else’s intellectual property rights;",
      "Is false, deceptive, or misleading;",
      "Contains unsolicited advertising or promotions, requests for donations, or spam;",
      "Contains private information, whether it is your own, or someone else’s;",
      "Encourages or facilitates an off-platform transaction;",
      "Contains prohibited medical drug claims;",
      "Sexualizes minors under the age of 18;",
      "Violates any of the terms of our Terms of Use and Privacy Policy.",
    ],
    subSection: {
      title:
        "While messaging/ communicating with Users and or Vendors you shall not:",
      list: [
        "Send unsolicited advertising or promotions, requests for donations or spam;",
        "Harass or abuse another Vendor or violate our policies;",
        "Contact someone after they have explicitly asked you not to; or",
        "Interfere with a transaction or the business of another Vendor;",
        "Exchange personal contact, financial or other information for the purposes of making an off-platform transactions including phone number, address, email, social media handles, external URLs, instructions for money transfer, QR codes, etc.",
        "Contact another Vendor via Messages to warn them away from a particular Vendor, shop, or item;",
        "Post in public areas to demonstrate or discuss a dispute with another User;",
        "Purchase from a Vendor for the sole purpose of leaving a negative review;",
        "Maliciously clicking on a competitor's ads in order to drain that User's advertising budget, also known as 'click fraud'.",
        "Creating or using an independent buyer account to maliciously up-vote another shop’s negative reviews in order to position those reviews more prominently.",
      ],
    },
  },
  {
    title: "XVI. Reviews",
    text: "A User can leave a review, including a one to five star rating [MMA Note: Client to confirm] and a photograph or video of their purchase. On the occasion you receive an unfavourable review, you can reach out to the buyer or leave a response. Your response to a review shall not contain:",
    list: [
      "Contain graphic, mature, or obscene language or imagery, or any content that is contrary to our policies;",
      "Be about things outside the Vendor’s control, such as a delivery company, us or a third party;",
      "Include false or fake comments or otherwise falsely inflate a shop’s review score; ",
      "Undermine the integrity of the Review system.",
    ],
  },
];

const VendorTOSAcceptance = ({ handleSubmit }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow container mx-auto px-4 py-8 pt-10 max-w-5xl">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8 lg:p-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <i className="fas fa-file-contract text-white text-2xl"></i>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Brand Terms of Service (TOS)
            </h1>
            <p className="text-gray-600">
              You must accept the terms below to continue to the Vendor
              Dashboard.
            </p>
          </div>

          <div className="border border-gray-300 rounded-xl max-h-[60vh] overflow-y-auto p-4 md:p-6 mb-8 bg-gray-50/50">
            <div className="space-y-6 text-sm">
              {tosContent.map((section, sectionIndex) => (
                <div key={sectionIndex} className="space-y-3">
                  <h2 className="text-lg font-extrabold text-gray-900 pt-2 border-t border-gray-300 first:border-t-0">
                    {section.title}
                  </h2>
                  {section.text && (
                    <p className="text-gray-700 leading-relaxed">
                      {section.text}
                    </p>
                  )}

                  {section.list.length > 0 && (
                    <ul className="list-disc list-outside space-y-2 pl-5 text-gray-700">
                      {section.list.map((item, itemIndex) => (
                        <li key={itemIndex} className="leading-relaxed">
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Sub-section */}
                  {section.subSection && (
                    <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
                      <h3 className="font-semibold text-gray-800 mb-2">
                        {section.subSection.title}
                      </h3>
                      {section.subSection.text && (
                        <p className="text-gray-700 leading-relaxed">
                          {section.subSection.text}
                        </p>
                      )}
                      {section.subSection.list?.length > 0 && (
                        <ul className="list-disc list-outside space-y-1 pl-5 text-gray-700 mt-2">
                          {section.subSection.list.map((item, itemIndex) => (
                            <li key={itemIndex} className="leading-relaxed">
                              {item}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={handleSubmit}
              className="flex-1 max-w-md flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:shadow-xl transition-all hover:scale-[1.02]"
            >
              <i className="fas fa-check-circle"></i> I Accept
            </button>
            <button
              onClick={() => navigate("/")}
              className="flex-1 max-w-md flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-8 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all"
            >
              Cancel / Go Home
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VendorTOSAcceptance;
