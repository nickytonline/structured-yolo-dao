import sdk from './1-initialize-sdk.js';

const bundleDrop = sdk.getBundleDropModule(
  '0xB6E4932F848A337Ad5FDDfD8a3113fAF90024312',
);

(async () => {
  try {
    const claimConditionFactory = bundleDrop.getClaimConditionFactory();
    // Specify conditions.
    claimConditionFactory.newClaimPhase({
      startTime: new Date(),
      maxQuantity: 3_141,
      maxQuantityPerTransaction: 1,
    });

    await bundleDrop.setClaimCondition(0, claimConditionFactory);
    console.log('✅ Sucessfully set claim condition!');
  } catch (error) {
    console.error('Failed to set claim condition', error);
  }
})();
