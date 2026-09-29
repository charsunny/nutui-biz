import { BaseLang } from "./base";

const enUS: BaseLang = {
  save: "Save",
  confirm: "Confirm",
  cancel: "Cancel",
  done: "Done",
  noData: "No Data",
  placeholder: "Placeholder",
  select: "Select",
  name: "Name",
  tel: "Tel",
  default: "Default",
  addres: "Addres",
  searchHistory: {
    recentSearchText: "Recent Search Text",
    searchDiscoverText: "Search Discover Text",
    noDiscoverDataText: "No Discover Data Text",
    rightOutIcon: "Search",
    deleteAll: "Delete All",
    finish: "Finish",
    hidden: "Hidden",
  },
  settleBar: {
    totalText: "Total",
    settleButtonText: "To Settle",
    selectAll: "Select All",
  },
  address: {
    selectRegion: "Select Region",
    deliveryTo: "Delivery To",
    chooseAnotherAddress: "Choose Another Address",
  },
  ecard: {
    chooseText: "Select",
    otherValueText: "Other Value",
    placeholder: "Placeholder",
  },
  receiveInvoiceEdit: {
    nameText: "name",
    namePlaceholder: "Please enter a name",
    nameErrorMsg: "This item is required, please fill it out and submit it",
    telText: "phone",
    telPlaceholder: "Please enter the mobile phone number of the consignee",
    telErrorMsg: "This item is required, please fill it out and submit it",
    regionText: "region",
    regionPlaceholder: "Please select your region",
    regionErrorMsg: "This item is required, please fill it out and submit it交",
    addressText: "address",
    addressPlaceholder: "Street, building numbe",
    addressErrorMsg: "This item is required, please fill it out and submit it",
    bottomText: "save",
  },
  sku: {
    buyNow: "Buy Now",
    buyNumber: "Buy Number",
    addToCard: "Add to Card",
    confirm: "Confirm",
  },
  skuheader: {
    skuId: "Sku Number",
  },
  addresslist: {
    addAddress: "Add New Address",
  },
  itemContents: {
    default: "Default",
  },
  swipeShell: {
    delete: "Delete",
  },
  generalShell: {
    copyAddress: "Copy Address",
    setDefault: "Set Default",
    deleteAddress: "Delete Address"
  },
  comment: {
    complaintsText: "I have a complaint",
    additionalReview: (day: number) => `Review after ${day} days of purchase`,
    additionalImages: (length: number) =>
      `There are ${length} follow-up comments`,
  },
  orderRemark: {
    placeholderText: "Please enter the content of the remarks",
    title: "Order Remarks",
    tagTitle: "Recommended Tags",
    submitText: "Confirm",
  },
  horizontalscrolling: {
    more: "More",
  },
  orderCancelPanel: {
    otherText: "other",
  },
  addressedit: {
    nameText: "Consignee",
    namePlaceholder: "Please enter the consignee",
    nameErrorMsg: "This item is required, please fill it out and submit it",
    telText: "Tel",
    telPlaceholder: "Please enter your phone number",
    telErrorMsg: "This item is required, please fill it out and submit it",
    regionText: "Region",
    regionPlaceholder: "Please select your region",
    regionErrorMsg: "This item is required, please fill it out and submit it",
    addressText: "Address",
    addressPlaceholder: "Street, building number",
    addressErrorMsg: "This item is required, please fill it out and submit it",
    bottomText: "Save",
    setDefaultText: "Set default address",
    errorToastText: "Please complete the required items",
  },
  login: {
    accountPlaceholder: "Please enter the account",
    telOrMailPlaceholder: "Please enter your phone number or email",
    passwordPlaceholder: "Please enter a password",
    verifyPlaceholder: "Please enter the verify code",
    verifyButtonText: "Get Code",
    getCodeErrorToast:
      "Please fill in the correct phone number or email address",
    switchLoginText1: "Account password login",
    switchLoginText2: "Mobile phone/email login",
    forgetPwdText: "Forgot Password",
    loginButtonText: "Login",
  },
  category: {
    pullUpText: "Scroll up to continue browsing",
  },
  goodsfilter: {
    confirm: "Confirm",
    reset: "Reset",
    priceRangeTitle: "Price Range",
    addressTitle: "Delivery Address",
    noAddress: "No address selected",
    modify: "Change",
    lowPrice: "Min",
    highPrice: "Max",
  },
};
export default enUS;
