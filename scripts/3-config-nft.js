import sdk from './1-initialize-sdk.js';
import { readFileSync } from 'fs';

const bundleDrop = sdk.getBundleDropModule(
  '0xB6E4932F848A337Ad5FDDfD8a3113fAF90024312',
);

(async () => {
  try {
    await bundleDrop.createBatch([
      {
        name: 'Badly drawn Structured YOLO',
        description: 'A poorly drawn Structured YOLO logo lol',
        image: readFileSync('scripts/assets/yolo.png'),
      },
    ]);
    console.log('✅ Successfully created a new NFT in the drop!');
  } catch (error) {
    console.error('failed to create the new NFT', error);
  }
})();
