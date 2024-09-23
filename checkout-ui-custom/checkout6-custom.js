//////////// PATBO CUSTOM ////////////

/** GTM TAG **/
(function() {
  var gtmId = "GTM-KPS8GXZ";
  var sendGA4EventsValue = "true"
  var sendGA4Events = sendGA4EventsValue == 'true'

  window.__gtm__ = {
    sendGA4Events
  }

    if (!gtmId) {
    console.error('Warning: No Google Tag Manager ID is defined. Please configure it in the apps admin.');
  } else {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ 'gtm.blacklist': [] });
  // GTM script snippet. Taken from: https://developers.google.com/tag-manager/quickstart
  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                                                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://inc.patbo.com.br/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                      })(window,document,'script','dataLayer',gtmId)
  }
})()
/** GTM TAG **/

/* eslint-disable */
var LS = {
  setItem(name, value, days) {
    let valueToStore;
    try {
      valueToStore = JSON.stringify(value);
    } catch (e) {
      console.error('Valor inválido para JSON:', e);
      return;
    }

    const item = {
      value: valueToStore,
      expiry: days ? new Date().getTime() + days * 24 * 60 * 60 * 1000 : null,
    };
    localStorage.setItem(name, JSON.stringify(item));
  },
  getItem(name) {
    const itemStr = localStorage.getItem(name);
    if (!itemStr) {
      return null;
    }

    let item;
    try {
      item = JSON.parse(itemStr);
    } catch (e) {
      console.error('Erro ao parsear JSON:', e);
      localStorage.removeItem(name);
      return null;
    }

    if (item.expiry && new Date().getTime() > item.expiry) {
      localStorage.removeItem(name);
      return null;
    }

    let value;
    try {
      value = JSON.parse(item.value);
    } catch (e) {
      console.warn('Valor armazenado não é um JSON:', e);
      value = item.value;
    }

    return value;
  },
  removeItem(name) {
    localStorage.removeItem(name);
  }
};

const COOKIE_MINICART_COUPON_KEY = 'xx_minicart_coupon'
const COOKIE_MINICART_COUPON_DAYS_EXP = 1

// Creates the error message
const errorMessage = document.createElement('span')
errorMessage.classList.add('help')
errorMessage.classList.add('error')
errorMessage.id = 'cepError'
errorMessage.textContent = 'CEP não encontrado.'

// Checks if CEP exists in VIACEP
async function verifyCEP(cep) {
  if(!cep) return

  const url = `https://viacep.com.br/ws/${cep}/json/`

  try {
    if (cep.length < 8 || cep.length > 9) {
      throw new Error('Invalid cep length')
    }

    const response = await fetch(url)
    const data = await response.json()

    if(data.erro) {
      throw new Error('Invalid CEP')
    }

  } catch (err) {
    handleCEPError()
  }
}

function handleCEPError() {
  if(!window) {
    return setTimeout(handleCEPError, 500);
  }

  const url = window.location.href

  const isShipping = url.indexOf('#/shipping') >= 0
  const isCart = url.indexOf('#/cart') >= 0

  const shippingOptions = document.getElementsByClassName('vtex-omnishipping-1-x-deliveryGroup')[0]
  const shippingForm = document.getElementsByClassName('vtex-omnishipping-1-x-addressForm')[0]
  const shippingInput = document.querySelector('.ship-postalCode')

  if(isShipping) {
    if(!shippingForm || !shippingOptions || !shippingInput) {
      return setTimeout(handleCEPError, 500);
    }

    shippingInput.append(errorMessage)
    shippingOptions.style.display = "none"
    shippingForm.style.display = "none"

    return
  }

  if(isCart) {
    const deliverSelect = document.querySelector('.srp-delivery-info')

    if(!deliverSelect) {
      return setTimeout(handleCEPError, 500);
    }

    deliverSelect.style.display = "none"
  }
}

window.addEventListener('hashchange', async function (change) {
  // Whenever the user enter #/shipping
  if (change.newURL.indexOf('#/shipping') >= 0 || change.newURL.indexOf('#/cart')) {
    const shippingInput = document.getElementById('ship-postalCode')

    if (shippingInput && shippingInput.value.length) {
      await verifyCEP(shippingInput.value)
    } else {
      await verifyCEP(vtexjs.checkout.orderForm.shippingData.address.postalCode)
    }
  }
})

var Scolados_Checkout = {
  methods: {
    steps: function () {
      var _hash = window.location.hash

      if (_hash == '#/cart') {
        $('.is--cart, .is--user, .is--shipping, .is--payment').removeClass(
          'is--active'
        )
        $('.is--cart').addClass('is--active')

        // create seller code input
        setTimeout(() => {
          const form = `\
              <form id="sellerCodeCart" name="sellerCode" class="seller-code">\
                <p>Código de vendedor</p> \
                <div class="wrapper">\
                  <input type="text" placeholder="Código" />\
                  <button id="btnSubmitSellerCode" type="submit">Adicionar</button>\
                  <span class="sellerError" style="margin: 5px 0; color: red; display: none">Cupom inválido, por favor, verifique o cupom inserido.</span>\
                </div>\
                <div class="wrapper response" style="display: none">\
                  <span class="sellerCode" style="margin: 5px 0px"></span>\
                </div>\
              </form>\
              `
          const freteNeutro = `<div id="frete-neutro"> <div> <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg"> <g clip-path="url(#clip0_1927_4683)"> <path fill-rule="evenodd" clip-rule="evenodd" d="M1.37294 7.62294C0.49386 8.50201 0 9.6943 0 10.9375V32.8125C-5.23319e-05 33.783 0.301143 34.7296 0.862013 35.5217C1.42288 36.3137 2.21578 36.9122 3.13125 37.2344C3.09405 38.0666 3.2236 38.8979 3.51229 39.6794C3.80099 40.4608 4.243 41.1767 4.81234 41.7848C5.38168 42.393 6.06686 42.8812 6.82759 43.2208C7.58833 43.5603 8.40928 43.7444 9.24217 43.7621C10.0751 43.7798 10.9031 43.6308 11.6776 43.3239C12.452 43.017 13.1574 42.5583 13.752 41.9749C14.3467 41.3915 14.8187 40.6951 15.1404 39.9266C15.462 39.1581 15.6268 38.3331 15.625 37.5H31.25C31.25 39.1576 31.9085 40.7473 33.0806 41.9194C34.2527 43.0915 35.8424 43.75 37.5 43.75C39.1576 43.75 40.7473 43.0915 41.9194 41.9194C43.0915 40.7473 43.75 39.1576 43.75 37.5H45.3125C46.5557 37.5 47.748 37.0061 48.6271 36.1271C49.5061 35.248 50 34.0557 50 32.8125V26.0969C50.0004 25.0313 49.6378 23.9975 48.9719 23.1656L44.3438 17.3844C43.905 16.8359 43.3487 16.3931 42.7159 16.0886C42.083 15.7841 41.3898 15.6256 40.6875 15.625H37.5V10.9375C37.5 9.6943 37.0061 8.50201 36.1271 7.62294C35.248 6.74386 34.0557 6.25 32.8125 6.25H4.6875C3.4443 6.25 2.25201 6.74386 1.37294 7.62294ZM6.35343 32.0261C5.40473 32.5504 4.60875 33.3125 4.04375 34.2375C3.76971 34.1136 3.53725 33.9132 3.37428 33.6605C3.21131 33.4077 3.12475 33.1133 3.125 32.8125V10.9375C3.125 10.5231 3.28962 10.1257 3.58265 9.83265C3.87567 9.53962 4.2731 9.375 4.6875 9.375H32.8125C33.2269 9.375 33.6243 9.53962 33.9174 9.83265C34.2104 10.1257 34.375 10.5231 34.375 10.9375V32.0875C33.4259 32.6372 32.6372 33.4259 32.0875 34.375H14.7875C14.2464 33.4358 13.4701 32.6536 12.5352 32.1052C11.6002 31.5569 10.5386 31.2612 9.45477 31.2474C8.37094 31.2335 7.30214 31.5019 6.35343 32.0261ZM40.6249 32.0874C39.6748 31.5388 38.5971 31.25 37.5 31.25V18.75H40.6875C40.9217 18.7503 41.1528 18.8033 41.3638 18.905C41.5747 19.0067 41.7601 19.1545 41.9062 19.3375L46.5312 25.1187C46.7531 25.3953 46.8744 25.7392 46.875 26.0938V32.8125C46.875 33.2269 46.7104 33.6243 46.4174 33.9174C46.1243 34.2104 45.7269 34.375 45.3125 34.375H42.9125C42.364 33.4249 41.575 32.6359 40.6249 32.0874ZM7.16529 35.2903C7.75134 34.7042 8.5462 34.375 9.375 34.375C10.2038 34.375 10.9987 34.7042 11.5847 35.2903C12.1708 35.8763 12.5 36.6712 12.5 37.5C12.5 38.3288 12.1708 39.1237 11.5847 39.7097C10.9987 40.2958 10.2038 40.625 9.375 40.625C8.5462 40.625 7.75134 40.2958 7.16529 39.7097C6.57924 39.1237 6.25 38.3288 6.25 37.5C6.25 36.6712 6.57924 35.8763 7.16529 35.2903ZM35.2903 35.2903C35.8763 34.7042 36.6712 34.375 37.5 34.375C38.3288 34.375 39.1237 34.7042 39.7097 35.2903C40.2958 35.8763 40.625 36.6712 40.625 37.5C40.625 38.3288 40.2958 39.1237 39.7097 39.7097C39.1237 40.2958 38.3288 40.625 37.5 40.625C36.6712 40.625 35.8763 40.2958 35.2903 39.7097C34.7042 39.1237 34.375 38.3288 34.375 37.5C34.375 36.6712 34.7042 35.8763 35.2903 35.2903ZM25.6524 13.759C25.4805 13.4438 25.1655 13.2323 24.8087 13.1925C24.4518 13.1527 24.098 13.2896 23.8608 13.5591C23.196 14.3149 22.6751 14.7124 21.8665 15.0325C20.9839 15.3818 19.7459 15.6447 17.588 16.0265C16.0439 16.271 14.6344 17.0402 13.6494 18.209C12.6595 19.3837 12.1747 20.8747 12.3169 22.3853C12.3535 22.7734 12.4305 23.1531 12.5448 23.52C12.3829 23.6594 12.2304 23.808 12.0879 23.9655C11.2437 24.8992 10.8048 26.0899 10.8048 27.381C10.8048 27.9885 11.2972 28.481 11.9048 28.481C12.5123 28.481 13.0048 27.9885 13.0048 27.381C13.0048 26.6458 13.2347 26.0184 13.648 25.5236C13.8732 25.7911 14.1236 26.0411 14.3969 26.2702C15.5779 27.2603 17.105 27.7958 18.6734 27.7917H18.6717V26.6917L18.6747 27.7917L18.6734 27.7917C23.0924 27.7908 27.2905 24.3041 27.2905 19.7995C27.2905 16.901 26.4426 15.2077 25.6524 13.759ZM15.8104 24.5843C15.7377 24.5235 15.6679 24.4606 15.601 24.3959C15.7042 24.3706 15.8108 24.3479 15.9209 24.3279L15.9211 24.3279C16.9562 24.1397 17.9792 23.7547 18.8359 23.3332C19.6826 22.9165 20.4394 22.4282 20.9187 21.9888C21.3666 21.5783 21.3968 20.8825 20.9863 20.4346C20.5758 19.9868 19.88 19.9566 19.4321 20.3671C19.1596 20.6169 18.6006 20.997 17.8646 21.3592C17.1386 21.7164 16.3121 22.0207 15.5277 22.1633L15.601 24.3959L15.5275 22.1634C15.1837 22.2258 14.8532 22.3096 14.5379 22.4141C14.5249 22.3361 14.5146 22.2577 14.5072 22.179C14.4224 21.2781 14.7075 20.3674 15.3317 19.6267C15.9587 18.8827 16.8853 18.3634 17.9396 18.1983L17.961 18.1947C20.0825 17.8194 21.5488 17.5243 22.6761 17.0781C23.3411 16.8149 23.8815 16.5027 24.3735 16.1149C24.7895 17.0768 25.0905 18.196 25.0905 19.7995C25.0905 22.8758 22.1017 25.5917 18.6717 25.5917L18.6686 25.5917C17.597 25.5947 16.5776 25.2276 15.8104 24.5843Z" fill="#C1A978" /> </g> <defs> <clipPath id="clip0_1927_4683"> <rect width="50" height="50" fill="white" /> </clipPath> </defs> </svg> </div> <div> <h2>FRETE CARBONO NEUTRO</h2> <p>Nós compensamos <strong>toda a emissão de carbono</strong> do frete do seu pedido.</p> </div> </div>`

          if (!$('#sellerCodeCart').length) {
            $(form).insertAfter(
              '.container-cart .forms.coupon-column.summary-coupon-wrap.text-center'
            )

            $('.seller-code input').on('input', function() {
              var inputValue = $(this).val();

              // Use a regular expression to test if the input contains only letters
              if (/[^a-zA-Z]/.test(inputValue)) {
                // If the input contains non-letter characters, remove them
                $(this).val(inputValue.replace(/[^a-zA-Z]/g, ''));
              }
            });
          }

          if (!$('#frete-neutro').length) {
            $(freteNeutro).insertAfter(
              '#shipping-preview-container .srp-content.onda-v1 .srp-main-title'
            )
          }

          function showCodeOnScreen(sellerCode) {
            if (!sellerCode || sellerCode === 'null' || sellerCode === '') {
              return
            }

            $('.sellerCode').html(`Código adicionado: ${sellerCode}`)

            $('.wrapper').css('display', 'none')
            $('.wrapper.response').css('display', 'block')
          }

          vtexjs?.checkout?.getOrderForm().then((orderForm) => {
            if (!orderForm || !orderForm?.marketingData) return

            const sellerCode = orderForm?.marketingData?.utmiCampaign

            if (!sellerCode || sellerCode === 'null' || sellerCode === '') {
              return
            }

            const couponFromCookie = LS.getItem(COOKIE_MINICART_COUPON_KEY)

            const initialSellerCoupon = couponFromCookie && couponFromCookie === sellerCode ? sellerCode : null

            initialSellerCoupon && showCodeOnScreen(initialSellerCoupon)
          })

          $('#btnSubmitSellerCode').on('click', (e) => {
            e.preventDefault()
            $('.sellerError')?.css('display', 'none')

            const sellerCodeInputValue = $('.seller-code input').val()

            if (!sellerCodeInputValue || sellerCodeInputValue === '') {
              return
            }

            fetch(
              `https://patbo.vtexcommercestable.com.br/api/dataentities/SC/search?_fields=name,sellerCode&_where=sellerCode=${sellerCodeInputValue.trim()}`
            ).then((response) =>
              response.json().then((data) => {
                if (data.length) {
                  vtexjs.checkout
                    .getOrderForm()
                    .then((orderForm) => {
                      const marketingData = orderForm.marketingData
                      return vtexjs.checkout.sendAttachment('marketingData', {
                        ...marketingData,
                        utmiCampaign: sellerCodeInputValue,
                      })
                    })
                    .done((orderForm) => {
                      const sellerCode = orderForm.marketingData.utmiCampaign

                      LS.setItem(
                        COOKIE_MINICART_COUPON_KEY,
                        sellerCode,
                        COOKIE_MINICART_COUPON_DAYS_EXP
                      )

                      showCodeOnScreen(sellerCode)
                    })
                } else {
                  $('.sellerError')?.css('display', 'flex')
                }
              })
            )
          })
        }, 1500)
      }

      if (_hash == '#/email' || _hash == '#/profile') {
        $('.is--cart, .is--user, .is--shipping, .is--payment').removeClass(
          'is--active'
        )
        $('.is--cart, .is--user').addClass('is--active')

        // Mudando texto de politica de privacidade e adicionando link
        setTimeout(() => {
          let spanPrivacy = document.querySelector(
            '#client-profile-data > div > div.accordion-body.collapse.in > div > div > form > div > p.newsletter > label > span'
          )

          spanPrivacy.innerHTML = ''

          spanPrivacy.innerHTML =
            'Aceito receber contatos e promoções de PatBO de acordo com as <a href="/institucional/politicas-de-privacidade" target="_blank" style="color: #000000; text-decoration: underline">Políticas de Privacidade</a>'
        }, 500)
      }

      if (_hash == '#/shipping') {
        $('.is--payment').removeClass('is--active')
        $('.is--cart, .is--user, .is--shipping').addClass('is--active')
      }

      if (_hash == '#/payment') {
        $('.is--cart, .is--user, .is--shipping, .is--payment').addClass(
          'is--active'
        )
      }
    },

    init: function () {
      this.steps()

      $(window).on('hashchange', function () {
        Scolados_Checkout.methods.steps()
      })
    },
    init_ajax: function () {},
  },
  ajax: function () {
    return this.methods.init_ajax()
  },
  mounted: function () {
    return this.methods.init()
  },
}

$(document).ready(function () {
  Scolados_Checkout.mounted();
  console.log("Tentativa de teste");


  if(window.location.href.match(/https\:\/\/www\.patbo\.com\.br\/checkout\/\?template\=popup\-c6\#\/cart/)){
    setTimeout(() => {
      showPopup();
    }, 3000);
  }

  vtexjs.checkout.getOrderForm().done(function(orderForm) {
    verifyCEP(orderForm?.shippingData?.address?.postalCode)
  })

  const previousXMLHttpRequest = window.XMLHttpRequest.prototype.open

  window.XMLHttpRequest.prototype.open = function (_, url) {
    this.addEventListener('load', async function () {
      const hasCallToPUB = url.indexOf('/api/checkout/pub/postal-code/BRA/') >= 0

      if(hasCallToPUB) {
        const response = JSON.parse(this.responseText)
        await verifyCEP(response?.postalCode)

        return
      }

      const hasCallToOrderForm = url.indexOf('/shippingData') >= 0

      if(hasCallToOrderForm) {
        const response = JSON.parse(this.responseText)
        const cep = response?.shippingData?.address?.postalCode

        await verifyCEP(cep)

        return
      }
    })

    return previousXMLHttpRequest.apply(this, arguments)
  }
})

function showPopup() {
  // Verifica se a URL contém '#/cart'
  if (window.location.hash === '#/cart') {
    // Seleciona o elemento com a classe 'cart-more-options'
    const container = document.querySelector('.cart-template.full-cart.span12.active');

    if (container) {
      // Cria um elemento de fundo para o pop-up
      const popupBackground = document.createElement('div');
      popupBackground.classList.add('container-popup-patbo-c6bank');

      // Cria o elemento do pop-up
      const popup = document.createElement('div');
      popup.classList.add('popup-patbo-c6bank');

      // Cria um link para envolver a imagem
      const link = document.createElement('div');
      // link.href = 'https://www.patbo.com.br/'; // link pop-up
      // link.target = '_blank'; // Abre o link em uma nova aba

      // Adiciona a imagem ao link
      const image = document.createElement('img');
      image.src = 'https://patbo.myvtex.com/arquivos/patbo-card-c6bank.png';
      image.alt = 'Logo';
      image.classList.add('popup-patbo-c6bank-image');
      link.appendChild(image); // Adiciona a imagem ao link

      popup.appendChild(link); // Adiciona o link (com a imagem) ao pop-up

      // Adiciona um botão de fechar
      const closeButton = document.createElement('button');
      closeButton.innerText = 'X';
      closeButton.classList.add('patbo-c6bank-popup-close-button');
      closeButton.onclick = function() {
        container.removeChild(popupBackground);
      };

      popup.appendChild(closeButton);

      // Adiciona o pop-up ao fundo
      popupBackground.appendChild(popup);

      // Adiciona o fundo ao container específico
      container.appendChild(popupBackground);

      // Adiciona o evento para fechar o pop-up ao clicar fora dele
      popupBackground.addEventListener('click', function(event) {
        if (event.target === popupBackground) {
          container.removeChild(popupBackground);
        }
      });

      // Remove o pop-up automaticamente após 5 segundos
      setTimeout(() => {
        if (container.contains(popupBackground)) {
          container.removeChild(popupBackground);
        }
      }, 5000);
    }
  }
}
