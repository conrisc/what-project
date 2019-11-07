/*
 * What API
 * This is what-api
 *
 * OpenAPI spec version: 1.1.0
 * Contact: you@your-company.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.4.9
 *
 * Do not edit the class manually.
 *
 */

import {ApiClient} from '../ApiClient';

/**
 * The SongItem model module.
 * @module model/SongItem
 * @version 1.1.0
 */
export class SongItem {
  /**
   * Constructs a new <code>SongItem</code>.
   * @alias module:model/SongItem
   * @class
   * @param title {String} 
   * @param url {String} 
   * @param dateAdded {String} 
   * @param tags {Array.<String>} 
   */
  constructor(title, url, dateAdded, tags) {
    this.title = title;
    this.url = url;
    this.dateAdded = dateAdded;
    this.tags = tags;
  }

  /**
   * Constructs a <code>SongItem</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/SongItem} obj Optional instance to populate.
   * @return {module:model/SongItem} The populated <code>SongItem</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new SongItem();
      if (data.hasOwnProperty('_id'))
        obj.id = ApiClient.convertToType(data['_id'], 'String');
      if (data.hasOwnProperty('title'))
        obj.title = ApiClient.convertToType(data['title'], 'String');
      if (data.hasOwnProperty('url'))
        obj.url = ApiClient.convertToType(data['url'], 'String');
      if (data.hasOwnProperty('dateAdded'))
        obj.dateAdded = ApiClient.convertToType(data['dateAdded'], 'String');
      if (data.hasOwnProperty('tags'))
        obj.tags = ApiClient.convertToType(data['tags'], ['String']);
    }
    return obj;
  }
}

/**
 * @member {String} id
 */
SongItem.prototype.id = undefined;

/**
 * @member {String} title
 */
SongItem.prototype.title = undefined;

/**
 * @member {String} url
 */
SongItem.prototype.url = undefined;

/**
 * @member {String} dateAdded
 */
SongItem.prototype.dateAdded = undefined;

/**
 * @member {Array.<String>} tags
 */
SongItem.prototype.tags = undefined;

