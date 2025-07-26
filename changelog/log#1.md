## Code Comparison

### Old Code (`routes/listings.js`)

```javascript
const validateListing = (req, res, next) => {
  console.log(req.body)  
  let {error} = joi_listingSchema.validate(req.body)
  const msg = error.details.map(el => el.message).join(',');
  if(error){
    throw new ExpressError(400, msg)
  }
  next()
}
```

### New Code (`routes/listings.js`)

```javascript
const validateListing = (req, res, next) => {
  let { error } = joi_listingSchema.validate(req.body);
  if (error) {
    let msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, msg);
  } else {
    next();
  }
}
```

### Explanation of Changes

The primary issue in the old code was that it would cause a crash when the Joi validation was successful. Here's a breakdown of the problem and the fix:

*   **The Problem:** When `joi_listingSchema.validate(req.body)` runs and the validation is successful, the `error` variable becomes `undefined`. The next line, `const msg = error.details.map(el => el.message).join(',');`, then tries to access the `details` property of `undefined`, which results in a `TypeError` and crashes the application.

*   **The Solution:** The new code addresses this by first checking if the `error` object exists. 
    *   If `error` exists (meaning validation failed), it proceeds to extract the error messages and throw an exception.
    *   If `error` is `undefined` (meaning validation was successful), it calls `next()` to pass control to the next middleware or route handler, avoiding the attempt to access `error.details`.

This ensures that the application doesn't crash on successful validation and handles both success and failure cases correctly.