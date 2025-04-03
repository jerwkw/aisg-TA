/**
 * @fileoverview This file defines TypeScript interfaces that model the data structures
 * returned by the Google Books API v1. These types primarily represent the
 * `Volume` resource and the common response format for volume-related
 * endpoints like searching (`volumes.list`) and retrieving individual
 * volumes (`volumes.get`).
 *
 *
 * @see https://developers.google.com/books/docs/v1/reference/volumes - Official Google Books API Volume Resource Reference
 * @see https://developers.google.com/books/docs/v1/using#WorkingWithVolumes - Guide on Working with Volumes
 */


/**
 * Google Books API response
 * Represents the response from the Google Books API when searching for books.
 */
export interface GBookApiResponse {
    kind: string;
    totalItems: number;
    items?: GBookItem[];
}


/**
 * Book object from Google Books API
 */
export interface GBookItem {
    kind: string;
    id: string;
    etag: string;
    selfLink: string;
    volumeInfo: VolumeInfo;
}

/**
 * VolumeInfo object from Google Books API
 */
export interface VolumeInfo {
    title: string;
    subtitle?: string;
    authors?: string[];
    publisher?: string;
    publishedDate?: string;
    description?: string;
    industryIdentifiers?: IndustryIdentifier[];
    readingModes?: {
        text: boolean;
        image: boolean;
    }
    pageCount?: number;
    printType?: string;
    categories?: string[];
    averageRating?: number;
    ratingsCount?: number;
    maturityRating?: string;
    contentVersion?: string;
    imageLinks?: ImageLinks;
    language?: string;
    previewLink?: string;
    infoLink?: string;
    canonicalVolumeLink?: string;
}

/**
 * Industry Identifier object from Google Books API
 */
export interface IndustryIdentifier {
    type: string;
    identifier: string;
}

/**
 * Image Links object from Google Books API
 */
export interface ImageLinks {
    smallThumbnail?: string;
    thumbnail?: string;
    small?: string;
    medium?: string;
    large?: string;
    extraLarge?: string;
}