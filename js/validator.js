(function(global, factory, plug){
  //调用工厂创建闭包
  return factory.call(global, global.jQuery, plug);
})(this, function($, plug){
  //默认值
  var __DEFS__ = {
    raise : "change"
  };
  //规则引擎
  var __RULES__ = {
    "require" : function(){
      return !!this.val();
    },//必填项
    "regex" : function(){
      var regex = eval("/"+this.data("bv-regex")+"/");
      return regex.test(this.val());
    },//正则表达式
    "email" : function(){
      return /^[_a-z0-9-\.]+@([-a-z0-9]+\.)+[a-z]{2,}$/i.test(this.val());
    },//邮箱地址
    "mobile" : function(){
      return /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/.test(this.val());
      },//手机号码
    "phone" : function(){
      return /0\d{2,3}-\d{7,8}/.test(this.val());
      },//座机号码
    "ipaddress" : function(){
      return /((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}/g.test(this.val());
      },//ip地址
    "number" : function(){
      return /^[0-9]*$/.test(this.val());
      },//数字
    "amount" : function(){
      return /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(this.val());
      }//金额
  }
  //创建$插件
  $.fn[plug] = function(ops){
    this.each(function(){
      var $this = $(this);
      $.extend($this, ops);
      $this.raise = $this.data("bv-raise") || $this.raise || __DEFS__.raise;
      var $fields = $this.find("[data-bv=true]");
      $fields.on($this.raise, function(){
        var $field = $(this);//目标元素
        var $group = $field.parents(".form-group").removeClass("has-success has-error");
        $group.find(".help-block").remove();
        var result = true, error = null;//校验结果
        $.each(__RULES__,function(rule, valid){
          if($field.data("bv-"+rule)){
            result = valid.call($field);
            if(!result){
              error = $field.data("bv-"+rule+"-error");
              $field.after("<span class=\"help-block\">"+error+"</span>")
            }
            return result;
          }
        });
        $group.addClass(result?"has-success":"has-error");
      })
    });
  };
}, "validator");