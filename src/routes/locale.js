const Log = require('not-log')(module, 'locale:route');
const {notError} = require('not-error');
const notNode = require('not-node');

async function get(req, res){
  try{
    let locale = req.params.locale;
    let result = await notNode.Application.getLogic('Locale').get({locale});
    res.status(200).json(result);
  }catch(err){
    Log.error(err);
    notNode.Application.report(
      new notError(
        `locale:route.get`, {
          locale:            req.query.locale,
          owner:             req.user?req.user._id:undefined,
          ownerModel:        'User'
        },
        err
      )
    );
    res.status(500).json({
      status: 'error'
    });
  }
}

async function available(req, res){
  try{
    let result = await notNode.Application.getLogic('Locale').available();
    res.status(200).json(result);
  }catch(err){
    Log.error(err);
    notNode.Application.report(
      new notError(
        `locale:route.available`, {
          owner:             req.user?req.user._id:undefined,
          ownerModel:        'User'
        },
        err
      )
    );
    res.status(500).json({
      status: 'error'
    });
  }
}


module.exports = {
  get,
  _get: get,
  available,
  _available: available,
};
