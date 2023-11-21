import { importFacebookData } from './importers/facebookImporter';
import { importInstagramData } from './importers/instagramImporter';
import { importTwitterData } from './importers/twitterImporter';

const dataSource = process.argv[2];

switch (dataSource) {
    case 'facebook':
        importFacebookData();
        break;
    case 'instagram':
        importInstagramData();
        break;
    case 'twitter':
        importTwitterData();
        break;
    default:
        console.log('Invalid data source specified. Use facebook, instagram, or twitter.');
}

