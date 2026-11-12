jQuery(document).ready(function($) {
  "use strict";

  // =========================================================================
  // EmailJS Configuration
  // 1. Create a free account at https://www.emailjs.com/
  // 2. Add an Email Service (Gmail -> shudhanshumishra971@gmail.com) -> copy Service ID
  // 3. Create an Email Template with variables: {{from_name}}, {{from_email}}, {{subject}}, {{message}} -> copy Template ID
  // 4. Go to Account -> General -> copy Public Key
  // =========================================================================
  var EMAILJS_PUBLIC_KEY = "TsiMUJEUjnblucuUx";
  var EMAILJS_SERVICE_ID = "service_bkxmok3";
  var EMAILJS_TEMPLATE_ID = "template_21jbuma";

  if (typeof emailjs !== "undefined" && EMAILJS_PUBLIC_KEY !== "YOUR_EMAILJS_PUBLIC_KEY") {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }

  // Contact Form Validation & EmailJS Submission
  $('form.contactForm').submit(function(e) {
    e.preventDefault();

    var f = $(this).find('.form-group'),
      ferror = false,
      emailExp = /^[^\s()<>@,;:\/]+@\w[\w\.-]+\.[a-z]{2,}$/i;

    f.children('input').each(function() { // run all inputs
      var i = $(this); // current input
      var rule = i.attr('data-rule');

      if (rule !== undefined) {
        var ierror = false; // error flag for current input
        var pos = rule.indexOf(':', 0);
        if (pos >= 0) {
          var exp = rule.substr(pos + 1, rule.length);
          rule = rule.substr(0, pos);
        } else {
          rule = rule.substr(pos + 1, rule.length);
        }

        switch (rule) {
          case 'required':
            if (i.val() === '') {
              ferror = ierror = true;
            }
            break;

          case 'minlen':
            if (i.val().length < parseInt(exp, 10)) {
              ferror = ierror = true;
            }
            break;

          case 'email':
            if (!emailExp.test(i.val())) {
              ferror = ierror = true;
            }
            break;

          case 'checked':
            if (!i.is(':checked')) {
              ferror = ierror = true;
            }
            break;

          case 'regexp':
            exp = new RegExp(exp);
            if (!exp.test(i.val())) {
              ferror = ierror = true;
            }
            break;
        }
        i.next('.validation').html((ierror ? (i.attr('data-msg') !== undefined ? i.attr('data-msg') : 'wrong Input') : '')).show('blind');
      }
    });

    f.children('textarea').each(function() { // run all textareas
      var i = $(this); // current textarea
      var rule = i.attr('data-rule');

      if (rule !== undefined) {
        var ierror = false; // error flag for current textarea
        var pos = rule.indexOf(':', 0);
        if (pos >= 0) {
          var exp = rule.substr(pos + 1, rule.length);
          rule = rule.substr(0, pos);
        } else {
          rule = rule.substr(pos + 1, rule.length);
        }

        switch (rule) {
          case 'required':
            if (i.val() === '') {
              ferror = ierror = true;
            }
            break;

          case 'minlen':
            if (i.val().length < parseInt(exp, 10)) {
              ferror = ierror = true;
            }
            break;
        }
        i.next('.validation').html((ierror ? (i.attr('data-msg') != undefined ? i.attr('data-msg') : 'wrong Input') : '')).show('blind');
      }
    });

    if (ferror) return false;

    if (
      typeof emailjs === "undefined" ||
      EMAILJS_PUBLIC_KEY === "YOUR_EMAILJS_PUBLIC_KEY" ||
      EMAILJS_SERVICE_ID === "YOUR_EMAILJS_SERVICE_ID" ||
      EMAILJS_TEMPLATE_ID === "YOUR_EMAILJS_TEMPLATE_ID"
    ) {
      $("#sendmessage").removeClass("show");
      $("#errormessage")
        .addClass("show")
        .html("EmailJS is not configured yet. Please add your Public Key, Service ID, and Template ID in contactform/contactform.js.");
      return false;
    }

    var $form = $(this);
    var $submitBtn = $form.find('button[type="submit"]');
    var originalBtnText = $submitBtn.text();
    $submitBtn.prop("disabled", true).text("Sending...");

    var templateParams = {
      name: $form.find('input[name="name"]').val().trim(),
      from_name: $form.find('input[name="name"]').val().trim(),
      email: $form.find('input[name="email"]').val().trim(),
      from_email: $form.find('input[name="email"]').val().trim(),
      reply_to: $form.find('input[name="email"]').val().trim(),
      title: $form.find('input[name="subject"]').val().trim(),
      subject: $form.find('input[name="subject"]').val().trim(),
      message: $form.find('textarea[name="message"]').val().trim(),
      to_email: "shudhanshumishra971@gmail.com"
    };

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams).then(
      function() {
        $("#sendmessage").addClass("show");
        $("#errormessage").removeClass("show");
        $form.find("input, textarea").val("");
        $submitBtn.prop("disabled", false).text(originalBtnText);
      },
      function(error) {
        var errDetail = (error && (error.text || error.message)) ? " (" + (error.text || error.message) + ")" : "";
        $("#sendmessage").removeClass("show");
        $("#errormessage")
          .addClass("show")
          .html("Failed to send message" + errDetail + ". Please try again or email directly at shudhanshumishra971@gmail.com.");
        console.error("EmailJS error:", error);
        $submitBtn.prop("disabled", false).text(originalBtnText);
      }
    );

    return false;
  });

});
