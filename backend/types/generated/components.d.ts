import type { Schema, Struct } from '@strapi/strapi';

export interface CharacteristicCharacteristic extends Struct.ComponentSchema {
  collectionName: 'components_characteristics';
  info: {
    description: 'A key-value characteristic for a property';
    displayName: 'Characteristic';
    icon: 'list';
  };
  attributes: {
    isWidget: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    prefix: Schema.Attribute.String;
    suffix: Schema.Attribute.String;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'characteristic.characteristic': CharacteristicCharacteristic;
    }
  }
}
