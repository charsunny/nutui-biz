export interface BaseLang {
  save: string;
  confirm: string;
  cancel: string;
  done: string;
  noData: string;
  placeholder: string;
  select: string;
  name: string;
  tel: string;
  default: string;
  addres: string;
  searchHistory: {
    recentSearchText: string;
    searchDiscoverText: string;
    noDiscoverDataText: string;
    rightOutIcon: string;
    deleteAll: string;
    finish: string;
    hidden: string;
    placeholder: string;
  };
  settleBar: {
    totalText: string;
    settleButtonText: string;
    selectAll: string;
  };
  address: {
    selectRegion: string;
    deliveryTo: string;
    chooseAnotherAddress: string;
  };
  ecard: {
    chooseText: string;
    otherValueText: string;
    placeholder: string;
  };
  receiveInvoiceEdit: {
    nameText: string;
    namePlaceholder: string;
    nameErrorMsg: string;
    telText: string;
    telPlaceholder: string;
    telErrorMsg: string;
    regionText: string;
    regionPlaceholder: string;
    regionErrorMsg: string;
    addressText: string;
    addressPlaceholder: string;
    addressErrorMsg: string;
    bottomText: string;
  };
  sku: {
    buyNow: string;
    buyNumber: string;
    addToCard: string;
    confirm: string;
  };
  skuheader: {
    skuId: string;
  };
  addresslist: {
    addAddress: string;
  };
  itemContents: {
    default: string;
  };
  swipeShell: {
    delete: string;
  };
  generalShell: {
    copyAddress: string;
    setDefault: string;
    deleteAddress: string;
  };
  comment: {
    complaintsText: string;
    additionalReview: (day: number) => string;
    additionalImages: (length: number) => string;
    totalImages: (length: number) => string;
  };
  coupon: {
    btnText: string;
  };
  invoiceTitleEdit: {
    titleTypeText: string;
    personalText: string;
    enterpriseText: string;
    titleText: string;
    titlePlaceholder: string;
    companyCodeText: string;
    companyCodePlaceholder: string;
    addressText: string;
    addressPlaceholder: string;
    companyPhoneText: string;
    companyPhonePlaceholder: string;
    bankDepositText: string;
    bankDepositPlaceholder: string;
    bankAccountText: string;
    bankAccountPlaceholder: string;
    submitButtonText: string;
  };
  invoiceTitleList: {
    defaultText: string;
    statusPass: string;
    statusVeto: string;
    statusApproval: string;
    companyCodeText: string;
    addressText: string;
    companyPhoneText: string;
    bankDepositText: string;
    bankAccountText: string;
    deleteText: string;
    editText: string;
  };
  orderRemark: {
    placeholderText: string;
    title: string;
    tagTitle: string;
    submitText: string;
  };
  horizontalscrolling: {
    more: string;
  };
  orderCancelPanel: { otherText: string };
  addressedit: {
    nameText: string;
    namePlaceholder: string;
    nameErrorMsg: string;
    telText: string;
    telPlaceholder: string;
    telErrorMsg: string;
    regionText: string;
    regionPlaceholder: string;
    regionErrorMsg: string;
    addressText: string;
    addressPlaceholder: string;
    addressErrorMsg: string;
    bottomText: string;
    setDefaultText: string;
    errorToastText: string;
  };
  login: {
    accountPlaceholder: string;
    telOrMailPlaceholder: string;
    passwordPlaceholder: string;
    verifyPlaceholder: string;
    verifyButtonText: string;
    getCodeErrorToast: string;
    switchLoginText1: string;
    switchLoginText2: string;
    forgetPwdText: string;
    loginButtonText: string;
  };
  category: {
    pullUpText: string;
  };
}
