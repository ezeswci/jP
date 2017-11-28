var paymentModal;
function openPaymentsModal()
{
  $('body').append(TEMPLATE_INAPP_PURCHASE);
  $("#paymentModal").modal();

  if(typeof paymentModal === 'undefined') {
    paymentModal = {
      pack: '',       // 'pack100', 'pack200', 'pack500'
      country: 'AR',    // 'AR', 'CL', 'MX', 'PE', 'US'
      method: '',     // 'mercadopago', 'paypal', 'paysafe'
      currency: 'ARS',    // 'ARS', 'MXN', 'CLP', 'PEN', 'USD'
      chips: 0,
      price: 0,
      countryName: 'Argentina',
      headerFlag: 'argentina',
      methodName: '',
      step: -1,
      selectedFlag: '',
      selectedMethodBtn: '',
      terms: false,
      retry: false,
      updateSteps: __PM_updateSteps,
      selectPack: __PM_SelectPack,
      selectCountry: __PM_SelectCountry,
      confirmCountry: __PM_ConfirmCountry,
      selectMethod: __PM_SelectMethod,
      confirmMethod: __PM_ConfirmMethod,
      checkTerms: __PM_checkTerms,
      startTransaction: __PM_startTransaction,
      notifyTransaction: __PM_notifyTransaction,
      onTransactionSuccess: __PM_transactionSuccess,
      onTransactionFailed: __PM_transactionFails,
    }
  }

  $("#pack100").html(__PM_getPriceFor('pack100',paymentModal.country) + ' $'+paymentModal.currency);
  $("#pack200").html(__PM_getPriceFor('pack200',paymentModal.country) + ' $'+paymentModal.currency);
  $("#pack500").html(__PM_getPriceFor('pack500',paymentModal.country) + ' $'+paymentModal.currency);
  $("#paymentModalCongratulations").slideUp();
  $("#paymentModalProcess").slideDown();
  $("#paymentModalBuyConfirmation").slideDown();
  $("#paymentModalErrorMessage").slideUp();
  //STEPS RESET.
  paymentModal.retry = false;
  paymentModal.terms = false;
  paymentModal.step = 0;
  paymentModal.updateSteps(true);

// LAST STEP CHECK RESET.
  $("#paymentModalTermsCheck").click(function(){
    paymentModal.checkTerms(this);
  });
  $("#paymentModalTermsCheck").prop('checked', false);
  $("#paymentModalBuyConfirmation").html('¡Comprar!');
  $("#paymentModalRetry").html('Intentar nuevamente');
  $("#paymentModalRetry").removeAttr('disabled');
  $("#paymentModalBuyConfirmation").attr('disabled','true');
  $("#payment-step-one").html("Elige tu pack");
  $("#payment-step-two").html("Elige tu país");
  $("#payment-step-three").html("Elige el método de pago");
  $("#payment-step-four").html("Confirma tu compra");
  checkLanguageElement($("#paymentModal"));
  jpAnalyticsEvent('OPEN_PAYMENT_POPUP','',0);
}

function __PM_updateSteps(firstTime = false) {
  $(".payment-modal .step").each(function(index,value) {
    $(this).removeClass('step-active');
    $(this).removeClass('step-blocked');
    $(this).removeClass('step-complete');

    if(index < paymentModal.step) {
      $(this).addClass('step-complete');
    }else if(index == paymentModal.step) {
      $(this).addClass('step-active');
    }else{
      $(this).addClass('step-blocked');
    }
  });

  // Setup steps content
  $(".payment-modal .step-content").each(function(index,value){
    var animation = (firstTime) ? "" : "slow";
    if(index < paymentModal.step) {
      $(this).slideUp(animation);
    }else if(index == paymentModal.step) {
      $(this).slideDown(animation);
    }else{
      $(this).hide();
    }
  });
}

function __PM_SelectPack(pack) {
  paymentModal.step++;
  paymentModal.pack = pack;
  paymentModal.chips = parseInt(pack.replace('pack',''));

  __PM_CalculatePrice();
  __PM_UpdateStepOne();
  jpAnalyticsEvent('PAYMENT_SELECT_PACK',pack,paymentModal.chips);
  paymentModal.updateSteps();
}

function __PM_UpdateStepOne() {
  var props = {
    '{CHIPS_AMOUNT}': paymentModal.chips,
    '{PRICE}': paymentModal.price,
    '{CURRENCY}': paymentModal.currency
  }
  $("#payment-step-one").html(parseTemplate(props,TEMPLATE_PAYMENT_MODAL_STEP1));
}

function __PM_SetCurrency() {
  switch (paymentModal.country) {
    case "AR": paymentModal.currency = "ARS"; break;
    case "MX": paymentModal.currency = "MXN"; break;
    case "CL": paymentModal.currency = "CLP"; break;
    case "PE": paymentModal.currency = "PEN"; break;
    case "US": paymentModal.currency = "USD"; break;
  }
}

function __PM_SetCountryName() {
  switch (paymentModal.country) {
    case "AR": paymentModal.countryName = "Argentina"; paymentModal.headerFlag = 'argentina'; break;
    case "MX": paymentModal.countryName = "Mexico"; paymentModal.headerFlag = 'mexico'; break;
    case "CL": paymentModal.countryName = "Chile"; paymentModal.headerFlag = 'chile'; break;
    case "PE": paymentModal.countryName = "Peru"; paymentModal.headerFlag = 'peru'; break;
    case "US": paymentModal.countryName = "Global"; paymentModal.headerFlag = 'all'; break;
  }
}

function __PM_SetMethodName() {
  switch (paymentModal.method) {
    case "mercadopago": paymentModal.methodName = "Mercado Pago"; break;
    case "paypal": paymentModal.methodName = "Paypal"; break;
    case "paysafe": paymentModal.methodName = "Paysafe Card"; break;
    default: paymentModal.methodName = ''; break;
  }
}

function __PM_CalculatePrice() {
  paymentModal.price = __PM_getPriceFor(paymentModal.pack,paymentModal.country);
}

function __PM_getPriceFor(pack,country) {
  var price = 0;
  var key = pack+"_"+country;
  switch (key) {
    case 'pack100_AR': price = 50; break;
    case 'pack200_AR': price = 100; break;
    case 'pack500_AR': price = 200; break;

    case 'pack100_CL': price = 2000; break;
    case 'pack200_CL': price = 4000; break;
    case 'pack500_CL': price = 8000; break;

    case 'pack100_MX': price = 50; break;
    case 'pack200_MX': price = 100; break;
    case 'pack500_MX': price = 200; break;

    case 'pack100_PE': price = 10; break;
    case 'pack200_PE': price = 20; break;
    case 'pack500_PE': price = 40; break;

    case 'pack100_US': price = 3; break;
    case 'pack200_US': price = 6; break;
    case 'pack500_US': price = 12; break;
  }
  return price;
}

function __PM_SelectCountry(flag,country) {

  if(flag != paymentModal.flag) {
    // select flag
    if(paymentModal.flag != '') {
      $(paymentModal.flag).removeClass("step-flag-selected");
      $(paymentModal.flag).addClass("step-flag");
    }
    $(flag).removeClass("step-flag");
    $(flag).addClass("step-flag-selected");
    $("#paymentModalCountryConfirmation").removeAttr("disabled");
    paymentModal.country = country;
    paymentModal.flag = flag;
  }else{
    // unselect flag
    $(flag).removeClass("step-flag-selected");
    $(flag).addClass("step-flag");
    $("#paymentModalCountryConfirmation").attr("disabled","true");
    paymentModal.country = 'US';
  }
  __PM_SetCountryName();
  __PM_SetCurrency();
  __PM_CalculatePrice();
  __PM_UpdateStepOne();
}

function __PM_ConfirmCountry() {
  jpAnalyticsEvent('PAYMENT_SELECT_COUNTRY',paymentModal.country,0);
  if(paymentModal.country == "AR" || paymentModal.country == "MX" || paymentModal.country == "CL") {
    $("#mercadoPagoMethod").show();

  }else{
    $("#mercadoPagoMethod").hide();
    if(paymentModal.method == 'mercadopago') {
      $(paymentModal.selectedMethodBtn).removeClass("payment-item-selected");
      $(paymentModal.selectedMethodBtn).addClass("payment-item");
      paymentModal.method = '';
      paymentModal.selectedMethodBtn = '';
      $("#paymentModalMethodConfirmation").attr("disabled","true");
    }
  }
  var props = {
    '{FLAG}': paymentModal.headerFlag,
    '{COUNTRY}': paymentModal.countryName
  }
  $("#payment-step-two").html(parseTemplate(props,TEMPLATE_PAYMENT_MODAL_STEP2));
  paymentModal.step++;
  paymentModal.updateSteps();
}

function __PM_SelectMethod(methodBtn,key) {

  if(methodBtn != paymentModal.selectedMethodBtn) {
    // select flag
    if(paymentModal.selectedMethodBtn != '') {
      $(paymentModal.selectedMethodBtn).removeClass("payment-item-selected");
      $(paymentModal.selectedMethodBtn).addClass("payment-item");
    }
    $(methodBtn).removeClass("payment-item");
    $(methodBtn).addClass("payment-item-selected");
    $("#paymentModalMethodConfirmation").removeAttr("disabled");
    paymentModal.method = key;
    paymentModal.selectedMethodBtn = methodBtn;
  }else{
    // unselect flag
    $(methodBtn).removeClass("payment-item-selected");
    $(methodBtn).addClass("payment-item");
    $("#paymentModalMethodConfirmation").attr("disabled","true");
    paymentModal.method = '';
  }
  __PM_SetMethodName();
}

function __PM_ConfirmMethod() {
  jpAnalyticsEvent('PAYMENT_SELECT_METHOD',paymentModal.method,0);
  $("#payment-step-three").html(paymentModal.methodName);
  paymentModal.step++;
  paymentModal.updateSteps();
}

function __PM_checkTerms(checkbox) {

  paymentModal.terms = $(checkbox).is(':checked');

  if(paymentModal.terms) {
    $("#paymentModalBuyConfirmation").removeAttr("disabled");
    jpAnalyticsEvent('PAYMENT_CHECK_TERMS','',0);
  }else{
    $("#paymentModalBuyConfirmation").attr("disabled","true");
  }
}
// Pagos android

function __PM_startTransaction() {
  paymentModal.notifyTransaction();
  //jpAnalyticsEvent('PAYMENT_START_CHECKOUT',paymentModal.currency,paymentModal.price);
  var action = '';
  var template = '';
  var dolars = 0;
  var chipsAmount = 0;
  // Let's set a pretty high verbosity level, so that we see a lot of stuff
    // in the console (reassuring us that something is happening).
    store.verbosity = store.INFO;

    // We register a dummy product. It's ok, it shouldn't
    // prevent the store "ready" event from firing.
    store.register({
        id:    'jp'+chipsAmount,
        alias: chipsAmount+' Chips',
        type:   store.CONSUMABLE
      });

    // When every goes as expected, it's time to celebrate!
    // The "ready" event should be welcomed with music and fireworks,
    // go ask your boss about it! (just in case)
    store.ready(function() {
        console.log("\\o/ STORE READY \\o/");
    });

    // After we've done our setup, we tell the store to do
    // it's first refresh. Nothing will happen if we do not call store.refresh()
    store.refresh();
  /*
  // PAYPAL EXCEPTION
  if(paymentModal.pack = 'pack100') {
    dolars = 3;
  }else if(paymentModal.pack = 'pack200') {
    dolars = 6;
  }else if(paymentModal.pack = 'pack500') {
    dolars = 12;
  }

  switch (paymentModal.method) {
    case 'mercadopago':
      if(paymentModal.country == 'AR') {
        action = 'http://data.jugaplay.com/mercado_pago/button.php';
        template = TEMPLATE_PAYMENT_CONTROL;
      } else if(paymentModal.country == 'CL') {
        action = 'http://data.jugaplay.com/mercado_pago/buttonChile.php';
        template = TEMPLATE_PAYMENT_CONTROL;
      } else if(paymentModal.country == 'MX') {
        action = 'http://data.jugaplay.com/mercado_pago/buttonMexico.php';
        template = TEMPLATE_PAYMENT_CONTROL;
      } else {
        avisoEmergenteJugaPlay("¡Ops!","<p>Hay un error en los datos. Reinicia el juego y vuelve a intentar.</p>");
      }
      break;

    case 'paypal':
      template = TEMPLATE_PAYMENT_PAYPAL;

      break;

    case 'paysafe':
      action = 'http://data.jugaplay.com/paysafe/button.php';
      template = TEMPLATE_PAYMENT_CONTROL;
      break;

    default:
      avisoEmergenteJugaPlay("¡Ops!","<p class='trn'>Hay un error en los datos. Reinicia el juego y vuelve a intentar.</p>");
      break;

  }  */

  var props = {
		'{ACTION}':action,
		'{USER_ID}':getUserJugaplayId(),
		'{CURRENCY}':paymentModal.currency,
		'{DOLARS}':dolars,
		'{CHIPS_AMOUNT}': paymentModal.chips
	}
	openNewWindowWithCheckControl(parseTemplate(props,template));

  if(paymentModal.retry) {
    $("#paymentModalRetry").html('<div class="ball-loader ball-loader-small"></div>');
    $("#paymentModalRetry").attr('disabled','true');
  } else {
    $("#paymentModalBuyConfirmation").html('<div class="ball-loader ball-loader-small"></div>');
    $("#paymentModalBuyConfirmation").attr('disabled','true');
  }
}

function __PM_transactionSuccess() {
  $("#success-user-coins").html(window.userDataJugaPlay.chips);
  $("#paymentModalProcess").slideUp("slow");
  $("#paymentModalCongratulations").slideDown("slow");
  jpAnalyticsEvent('PAYMENT_CONFIRMED','',0);
}

function __PM_transactionFails(msg = '') {

  $("#paymentModalErrorMessageBody").html(msg);
  $("#paymentModalBuyConfirmation").slideUp("slow");
  $("#paymentModalErrorMessage").slideDown("slow");
  $("#paymentModalRetry").html('Intentar nuevamente');
  $("#paymentModalRetry").removeAttr('disabled');
  paymentModal.retry = true;
}

function __PM_notifyTransaction() {
  var url = getJPApiURL()+"comments";

	$.ajaxSetup({
    crossDomain: true,
    xhrFields: {withCredentials: true}
	});

  var props = {
    '{METHOD}': paymentModal.method,
    '{COUNTRY}': paymentModal.country,
    '{PACK_CHIPS}': paymentModal.pack,
    '{USER_ID}': window.userDataJugaPlay.id,
    '{USER_MAIL}':getUserJugaplayEmail()
  }

  var sdata = {
    "comment": {
      "sender_name": "Payment",
      "sender_mail": getUserJugaplayEmail(),
      "content": parseTemplate(props,TEMPLATE_PAYMENT_NOTIFICATION)
    }
  };

	$.post(url, sdata, function(data) {},"json")
  .fail(function(xhr) {
		if(xhr.readyState == 4 && xhr.status == 401) {
			ifLogInIsNeed();
		}else{
			avisoEmergenteJugaPlayConnectionError();
		}
  });
}



// ============================================================================
// ----------------------    MODAL    -----------------------------------------
// ============================================================================
var TEMPLATE_INAPP_PURCHASE = ''
+'<div class="modal fade payment-modal" id="paymentModal">'
+'  <div class="modal-dialog" role="document">'
+'    <div class="modal-content">'
+'      <div class="modal-header">'
+'        <h5 class="modal-title trn">COMPRAR FICHAS</h5>'
+'        <button type="button" class="close" data-dismiss="modal" aria-label="Close">'
+'          <span aria-hidden="true">&times;</span>'
+'        </button>'
+'      </div>'
+'      <div class="modal-body">'
+'				<div id="paymentModalCongratulations">'
+'					<img src="img/banners/congrats_popup.jpg" style="width: 50%;transform: translate(50%,0%);"/>'
+'					<p class="congrats-message text-center trn">Ya se encuentran acreditadas tus fichas. Ahora tienes:</p>'
+'					<p class="congrats-prize text-center"><b id="success-user-coins">231</b> <img src="img/icons/coins/chip.svg" /></p>'
+'				</div>'
+'				<div id="paymentModalProcess" class="container-fluid content nopadding">'
+'					<div class="row-fluid">'
+'						<div class="col-xs-12 step"><b class="position">1.</b> <span id="payment-step-one" class="trn">Elige tu pack</span><i class="fa fa-check"></i></div>'
+'						<div class="col-xs-12 step-content nopadding">'
+'							<div class="container-fluid nopadding">'
+'								<div class="row-fluid">'
+'									<div class="col-xs-4 first-content-col">'
+'										<p class="text-center"><b>+100 <img src="img/icons/coins/chip.svg" class="chips-icon"/></b></p>'
+'										<img src="img/icons/buy/pack10.jpg" class="img img-responsive" />'
+'										<button id="pack100" class="btn btn-success btn-block btn-fancy btn-sm" onclick="paymentModal.selectPack(\'pack100\')">50 $AR</button>'
+'									</div>'
+'									<div class="col-xs-4 first-content-col">'
+'										<p class="text-center"><b>+200 <img src="img/icons/coins/chip.svg" class="chips-icon"/></b></p>'
+'										<img src="img/icons/buy/pack20.jpg" class="img img-responsive" />'
+'										<button id="pack200" class="btn btn-success btn-block btn-fancy btn-sm" onclick="paymentModal.selectPack(\'pack200\')">100 $AR</button>'
+'									</div>'
+'									<div class="col-xs-4 first-content-col">'
+'										<p class="text-center"><b>+500 <img src="img/icons/coins/chip.svg" class="chips-icon"/></b></p>'
+'										<img src="img/icons/buy/pack50.jpg" class="img img-responsive" />'
+'										<button id="pack500" class="btn btn-success btn-block btn-fancy btn-sm" onclick="paymentModal.selectPack(\'pack500\')">200 $AR</button>'
+'									</div>'
+'								</div>'
+'							</div>'
+'						</div>'
+'						<div class="col-xs-12 step"><b class="position">2.</b> <span id="payment-step-two" class="trn">Elige tu país</span><i class="fa fa-check"></i></div>'
+'						<div class="col-xs-12 step-content text-center nopadding">'
+'							<div class="container-fluid nopadding">'
+'								<div class="row-fluid">'
+'									<div class="col-xs-4 step-flag" onclick="paymentModal.selectCountry(this,\'AR\')">'
+'										<img src="img/icons/flags/argentina.jpg"  class="img-responsive"/>'
+'										<p>ARGENTINA</p>'
+'									</div>'
+'									<div class="col-xs-4 step-flag" onclick="paymentModal.selectCountry(this,\'CL\')">'
+'										<img src="img/icons/flags/chile.jpg"  class="img-responsive"/>'
+'										<p>CHILE</p>'
+'									</div>'
+'									<div class="col-xs-4 step-flag" onclick="paymentModal.selectCountry(this,\'MX\')">'
+'										<img src="img/icons/flags/mexico.jpg"  class="img-responsive"/>'
+'										<p>MEXICO</p>'
+'									</div>'
+'								</div>'
+'								<div class="row-fluid">'
+'									<div class="col-xs-4 step-flag" onclick="paymentModal.selectCountry(this,\'PE\')" >'
+'										<img src="img/icons/flags/peru.jpg" class="img-responsive"/>'
+'										<p>PERU</p>'
+'									</div>'
+'									<div class="col-xs-4 step-flag" onclick="paymentModal.selectCountry(this,\'US\')">'
+'										<img src="img/icons/flags/all.jpg"  class="img-responsive"/>'
+'										<p>GLOBAL</p>'
+'									</div>'
+'									<div class="col-xs-4 step-flag">'
+'									</div>'
+'								</div>'
+'								<div class="row-fluid">'
+'									<div class="col-xs-12">'
+'										<button id="paymentModalCountryConfirmation" disabled="true" class="btn btn-success btn-block btn-fancy btn-sm trn" onclick="paymentModal.confirmCountry()">Elegir país</button>'
+'									</div>'
+'								</div>'
+'							</div>'
+'						</div>'
+'						<div class="col-xs-12 step"><b class="position">3.</b> <span id="payment-step-three" class="trn">Elige el método de pago</span><i class="fa fa-check"></i></div>'
+'						<div class="col-xs-12 step-content nopadding">'
+'							<div class="container-fluid nopadding">'
+'								<div class="row-fluid nopadding">'
+'									<div class="col-xs-6" id="mercadoPagoMethod">'
+'										<div class="payment-item" onclick="paymentModal.selectMethod(this,\'mercadopago\')">'
+'											<img src="img/icons/payments/mercado_pago.png" class="img-responsive" />'
+'										</div>'
+'									</div>'
+'									<div class="col-xs-6">'
+'										<div class="payment-item" onclick="paymentModal.selectMethod(this,\'paypal\')">'
+'											<img src="img/icons/payments/pay_pal.png" class="img-responsive" />'
+'										</div>'
+'									</div>'
+'								</div>'
+'								<div class="row-fluid nopadding">'
+'									<div class="col-xs-6">'
+'										<div class="payment-item" onclick="paymentModal.selectMethod(this,\'paysafe\')">'
+'											<img src="img/icons/payments/Paysafecard.png" class="img-responsive" />'
+'										</div>'
+'									</div>'
+'								</div>'
+'								<div class="row-fluid nopadding">'
+'									<div class="col-xs-12">'
+'										<button id="paymentModalMethodConfirmation" disabled="true" class="btn btn-success btn-block btn-fancy btn-sm trn" onclick="paymentModal.confirmMethod()">Continuar</button>'
+'									</div>'
+'								</div>'
+'							</div>'
+'						</div>'
+'						</div>'
+'						<div class="col-xs-12 step"><b class="position">4.</b> <span id="payment-step-four">Confirma tu compra</span><i class="fa fa-check"></i></div>'
+'						<div class="col-xs-12 step-content">'
+'							<p class="trn">Se abrirá una ventana nueva para completar el pago de forma segura.</p>'
+'							<label class="payment-terms">'
+'								<input type="checkbox" value="" id="paymentModalTermsCheck">'
+'								<span class="trn">Acepto los</span> <a href="terms-conditions.html" target="_blank" class="trn">términos y condiciones</a>.'
+'							</label>'
+'							<br />'
+'							<button id="paymentModalBuyConfirmation" disabled="true" class="btn btn-success btn-block btn-fancy btn-sm trn" onclick="paymentModal.startTransaction()">¡Comprar!</button>'
+'							<div id="paymentModalErrorMessage">'
+'								<p style="color: orange" class="text-center"><span class="trn"><b>¡Vaya!</b> Ha ocurrido un error.</span><br /><span id="paymentModalErrorMessageBody"><span class="trn">No se ha completado el pago.</span></span></p>'
+'								<button id="paymentModalRetry" class="btn btn-success btn-block btn-fancy btn-sm trn" onclick="paymentModal.startTransaction(true)">Intentar nuevamente</button>'
+'							</div>'
+'						</div>'
+'					</div>'
+'				</div>'
+'      </div>'
+'    </div>'
+'  </div>'
+'</div>'

/*
var props = {
  '{METHOD}': ,
  '{COUNTRY}': ,
  '{AMOUNT_CHIPS}': ,
  '{USER_ID}': ,
  '{USER_MAIL}':
}
*/
var TEMPLATE_PAYMENT_NOTIFICATION = 'Quiere pagar {PACK_CHIPS} con {METHOD} ({COUNTRY}), ID: {USER_ID} ({USER_MAIL})';

/*
var props = {
	'{ACTION}':getUserJugaplayId(),
	'{USER_ID}':getUserJugaplayId(),
	'{CURRENCY}',
	'{CHIPS_AMOUNT}'
}
*/
var TEMPLATE_PAYMENT_CONTROL = ''
		+'<form name="pg_frm" method="post" id="myPaymentForm" action="{ACTION}" >'
		+'	<input type="hidden" name="mp_user" value="{USER_ID}">'
		+'	<input type="hidden" name="mp_currency" value="{CURRENCY}">'
		+'	<input type="hidden" name="mp_chips" value="{CHIPS_AMOUNT}">'
		+'	<button type="submit" class="btn btn-primary no-margin no-padding btn-style1">¡Comprar Fichas!</button>'
		+'</form>';

/*
var props = {
	'{DOLARS}':,
	'{USER_ID}':getUserJugaplayId(),
	'{CHIPS_AMOUNT}'
}
*/
var TEMPLATE_PAYMENT_PAYPAL = ''
    +'<form name="pg_frm" method="post" id="myPaymentForm" action="https://www.paypal.com/cgi-bin/webscr" >'
    +'  <input type="hidden" name="cmd" value="_xclick">'
    +'  <input type="hidden" name="business" value="info@jugaplay.com">'
    +'  <input type="hidden" name="item_name" value="JP-{CHIPS_AMOUNT}">'
    +'  <input type="hidden" name="amount" value="{DOLARS}">'
    +'  <input type="hidden" name="custom" value="{USER_ID}">'
    +'  <input type="hidden" name="currency_code" value="USD">'
    +'  <input type="hidden" name="notify_url" value="http://data.jugaplay.com/paypal/receive-ipn.php">'
    +'  <input type="hidden" name="return" value="http://www.jugaplay.com/paymentOk.html">'
    +'  <input type="hidden" name="cancel_return" value="http://www.jugaplay.com/paymentCancel.html">'
    +'  <input type="image" name="submit" src="https://www.paypalobjects.com/en_US/i/btn/btn_buynow_LG.gif" alt="PayPal - The safer, easier way to pay online">'
    +'</form>';

/*
var props = {
	'{CHIPS_AMOUNT}': ,
	'{PRICE}': ,
	'{CURRENCY}'
}
*/
var TEMPLATE_PAYMENT_MODAL_STEP1 = ''
    + '{CHIPS_AMOUNT}<img src="img/icons/coins/chip.svg" class="chip">&nbsp;&nbsp;por {PRICE} <b>${CURRENCY}</b>';
/*
var props = {
	'{FLAG}': ,
	'{COUNTRY}':
}
*/
var TEMPLATE_PAYMENT_MODAL_STEP2 = ''
    + '<img src="img/icons/flags/{FLAG}.jpg" class="img-responsive" style="height: 18px;display: inline;">&nbsp;&nbsp;{COUNTRY}';



//end
