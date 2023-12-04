import { importFacebookPostData } from './importers/facebookPostImporter';
import { importInstagramPostData } from './importers/instagramPostImporter';
import { importTweetData } from './importers/tweetImporter';

const dataSource = process.argv[2];

switch (dataSource) {
    case 'facebookPosts':
        importFacebookPostData();
        break;
    case 'instagramPosts':
        importInstagramPostData();
        break;
    case 'tweets':
        importTweetData();
        break;
    default:
        console.log('Invalid data source specified. Use facebookPosts, instagramPosts, or tweets.');
}

