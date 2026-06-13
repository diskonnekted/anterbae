// Anterbae Delivery Service - Schema Types
import { courierType } from './courierType'
import { deliveryOrderType } from './deliveryOrderType'
import { merchantType } from './merchantType'
import { appSettingsType } from './appSettingsType'
import { courierApplicationType } from './courierApplicationType'
import { articleType } from './articleType'
import { bannerType } from './bannerType'
import { customerType } from './customerType'

import { productType } from './productType'
import { categoryType } from './categoryType'

export const schemaTypes = [
  // Core business
  deliveryOrderType,
  courierType,
  merchantType,
  productType,
  categoryType,
  courierApplicationType,
  // Supporting
  customerType,
  articleType,
  bannerType,
  appSettingsType,
]
