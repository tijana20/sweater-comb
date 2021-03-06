import { responseHeaderRules } from "./header-rules";
import { lifecycleRuleset } from "./lifecycle-rules";
import { operationRules } from "./operation-rules";
import { propertyRules } from "./property-rules";
import { specificationRules } from "./specification-rules";
import {
  statusCodesRules,
  jsonApiContentTypeRule,
  resourceObjectRules,
  paginationRules,
  doNotAllowDeleteOrPostIdForSingleton,
  compoundDocuments,
} from "./json-api-rules";

//
export const resourceRules = [
  responseHeaderRules,
  lifecycleRuleset,
  operationRules,
  propertyRules,
  specificationRules,
  statusCodesRules,
  jsonApiContentTypeRule,
  resourceObjectRules,
  paginationRules,
  doNotAllowDeleteOrPostIdForSingleton,
  compoundDocuments,
];

export const compiledRules = [
  responseHeaderRules,
  // TODO: fix these or provide alternatives for compiled aggregate specs
  //lifecycleRuleset,
  //operationRules,
  //propertyRules,
  //specificationRules,
  statusCodesRules,
  jsonApiContentTypeRule,
  resourceObjectRules,
  paginationRules,
  doNotAllowDeleteOrPostIdForSingleton,
  compoundDocuments,
];
