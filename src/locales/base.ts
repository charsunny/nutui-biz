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
    // eslint-disable-next-line @typescript-eslint/ban-types
    additionalReview: Function;
    // eslint-disable-next-line @typescript-eslint/ban-types
    additionalImages: Function;
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
  goodsfilter: {
    confirm: string;
    reset: string;
    priceRangeTitle: string;
    addressTitle: string;
    noAddress: string;
    modify: string;
    lowPrice: string;
    highPrice: string;
  };
}
