var React   = require("react");
var Request = require("superagent");

var ActionCreators = require('../actions/ActionCreators');

var Upload = React.createClass({

  componentDidMount: function(){
    $("#file-upload-button").change(function () {
      var fileName = $(this).val().replace('C:\\fakepath\\', '');
      $("#file-upload-filename").html(fileName);
    });
  },

  handleChange: function() {
    $("#shareID").show();
  },

  render: function() {


    var image_api_url = './api/image';

    return (
        <div className="modal fade" id="myModal">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header custom_modal_header">
                <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
                <h4 className="modal-title">Upload your image!</h4>
              </div>
              <div className="modal-body">
                <form action="/api/user/images" method="POST" encType="multipart/form-data" id="dog" ref="upload">
                  <div className="file-upload-container">
                    <div className="file-upload-override-button left">
                    Choose image
                    <input type="file" name="image_link" ref="image" className="file-upload-button" id="file-upload-button" onChange={this.handleChange}/>
                    </div>
                    <div className="file-upload-filename left" id="file-upload-filename">No image selected</div>
                    <div className="both"></div>
                    </div>
                    <div className="share-button-container">
                      <input type="submit" value="Share image" id="shareID" className="btn btn-lg"/>
                    </div>
                  </form>
              </div>
            </div>
          </div>
        </div>
    );


  }

});

module.exports = Upload;
