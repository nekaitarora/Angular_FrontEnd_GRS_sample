
1.1.0 / 2014-10-08
==================

 * deactivate system message temporarily
 * add header message for fb admins
 * Fixed index-bug in country-list
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * fix 1249 - fan profile images disappear after becoming fan
 * changed es config for logstash
 * fix GR-1251 earning count up for each vote after purchase
 * set correct window reference for facebook frame
 * post customCallbackUrl to payment
 * Merge branch 'payment'
 * Bank: Display gross instead of net income, no dollar amount if not foreign currency payment
 * Make Bank view to handle display payments correctly
 * update login error texts GR-1254
 * set user type at implicit login
 * check for login error GR-1254
 * Merge branch 'master' into payment
 * only set user if a valid user is returned GR-1254
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * use target blank in facebook for fans
 * hero.jade changes
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * use fb popup if we are not inside fb app
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * typo
 * do not use deeply nested subdomains for fb app (certificate does not allow this)
 * Merge branch 'stage'
 * Merge branch 'stage' of git.lan.ddg:global-rockstar/global-rockstar-frontend into stage
 * fix crumb ignores
 * Fixed width on country selector
 * Merge branch 'stage' of vcs.diamonddogs.cc:globalrockstar-frontend into stage
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * Added missing background image to artist profile, adapted hero banner
 * fix wrong quote
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * make close button element directive aware
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * Merge brt pull ddgit master anch 'master' of git.lan.ddg:global-rockstar/global-rockstar-frontend
 * always check if variable is not null
 * temp. do not show add to FB box
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * get location from request
 * webm versus mp4 slider in hero.jade
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * Merge branch 'stage'
 * use media query combiner in dev, too
 * add nofollow to links in biography
 * use autolinker to link links in biography
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * Added missing "no team member found" string
 * Merge branch 'master' into stage
 * do not transclude but replace the close button element
 * Changed Message Style in Arena
 * Fixed close-overlay-btn
 * Updated PayPal texts and UI
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * Changed Facebook comments width to 100%
 * Save dollar amount and exchangeRate in project payments Complete Projects based on the dollarAmounts
 * ensure that redirection on login goes to the right domain
 * Merge branch 'master' into stage
 * update redirection url after fb user login
 * Merge branch 'payment'
 * Foreign currency Payment UI
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * Added fallback facebook redirect
 * fix 1228 - remove add to facebook on facebook
 * Removed logs from /team
 * Temporarily removed mobile votes from stats, updated layout of fan sidebar
 * Merge branch 'master' into payment
 * Yes/No implementation for modal service
 * Added PayPal-Information page to footer
 * Decreased size of Video-Slider buttons
 * Moved "Add to facebook" to its own box
 * Check currency before initialise payment - WIP
 * remove console dir
 * remove pointer events
 * fix js error
 * fix typo in arena
 * remove premature return
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * fix adding fb pages
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * Fix typo and set to USD by default
 * Merge branch 'artist-profile-on-facebook'
 * Check paypal_verified AND paypal_currency before starting PayPal payment
 * Merge branch 'master' into artist-profile-on-facebook
 * fix minor fb config issues
 * Merge branch 'master' into payment
 * add profile app url for redirection
 * fix refdirection
 * remove profile from available configs
 * Remove currency Setting from UI
 * Code readability & remove obsolete Save button
 * use normal app id for artists
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * Added Team-Page
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * added opacity 0 for hero and remove with delay to hide image loading
 * use host for redirects
 * update stage urls
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * Added helper that links urls in text area and used if for biography
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * fallback image and height resizing
 * get everything in place for redirection logic
 * use redirect to have correct facebook page GR-137
 * removed mute btn on mobiles
 * video slide pause on slider event. play/pause button state depending on video state
 * Merge branch 'paypal-form'
 * update stage and live facebook urls
 * Initgrate new PayPal form into Project and Paritcipate view Move all UI strings to en.js file
 * add configs for all facebook apps GR-137
 * obtain the appid dynamically from the hostname GR-137
 * Added Facebook Comments and Meta Tags to Crowdfunding Detail Page
 * Added background-images and -colors to each page view
 * Merge branch 'master' into artist-profile-on-facebook
 * fix require login for become fan
 * fix require login always showing facebook template
 * use angular to populate fans dynamically
 * New payPal form - save logic - styling
 * fix arena ROCKN VOTE not triggering correctly
 * try to fix become fan on facebook
 * New payPal form - WIP
 * fix links and jump to top on login
 * Added ClickTracking to Arena National Presenter
 * fix footer and header links
 * Added .ellipsis to country selector
 * add missing function isActive (lost in merge commit)
 * use target blank on logo in facebook
 * Merge branch 'master' into artist-profile-on-facebook
 * remove commented out code
 * add missing file
 * move legacy sidebar boxes to seperate partial
 * add to fb page is no longer bound to own profile GR-137
 * prevent welcome message on facebook GR-137
 * fix typo that prevented closing of modal GR-137
 * New payPal form - WIP
 * voting fixes
 * MergeZZU branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * added arena debug route
 * add triggers for become fan, twitter, vouchers GR-137
 * hide and move components an fb artist detail GR-137
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * Added additional check for existing promo video
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * Updated "hard date" to upload phase
 * Add stub Route/Controller to check if account accepts a currency
 * return 404 if artist deleted or inactive
 * get slashes right
 * redirect to correct url
 * use https
 * wrong phase name
 * update stage config
 * update button text
 * update stage config to reflect FB data
 * Text adaptions on add/edit project form
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * Added Format Toggle on "Add Song" and "Add/Edit Project"
 * update login button text
 * change directive order
 * reload voting options after failure
 * trigger vote after login
 * Merge branch 'master' into paypal-micropayment-account
 * Displaying song country flag instead of artist country flag
 * remove debugger statement
 * fix typo
 * resolve feedback from server GR-137
 * remove display popup to get app working on facebook without popupblocker GR-127
 * get facebook login redirection working GR-137
 * Merge branch 'cta-buttons-on-vote-feedback' into artist-profile-on-facebook
 * close popup after cta button click
 * call facebook voting
 * Testing Homepage Slider Fallback Images for Mobile Devices
 * get registration via facebook working
 * Fixed small frontend behaviour on crowdfunding detail page
 * Merge branch 'master' into paypal-micropayment-account
 * Merge branch 'master' into artist-profile-on-facebook
 * call init all paypal forms when data is loaded
 * remove logging
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * escape single quote in artist name GR-1202
 * successfull client login on fb page profile
 * add auto login if user is connected on facebook GR-137
 * show complete button "add to facebook page"
 * make container autogrow on facebook
 * add settings cache time
 * extract partials from artist detail
 * add fb lib to parse signed request
 * add redirection to artist page
 * add keys + cert for https server
 * add https server and endpoint for artist facebook pages GR-138
 * add facebook page from own profile GR-138
 * Changed "Hot to Vote"-Video also in Overlay
 * Changed texts
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * Provide meaningful error messages for PayPal account verification form
 * Text and country selector adaptions
 * get imagepath and link correct for sponsors
 * Some text adaptions
 * add cta buttons in arena
 * Updated voting serie text
 * Updated PayPal texts
 * pass correct object around after supervote
 * start voting options
 * implement cta buttons after voting GR-948
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * add error habdling for crowdfunding and set cache time for ocntents to 5min
 * Adapted CSS on crowdfunding content block
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * Added content-block to crowdfunding page
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * use table styles from artists on fan stats
 * Changed texts on already voted dialogs
 * add target blank to media downloads
 * update arena texts GR-1183
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * use youtube.id instead of id GR-1176
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * Duplicate YoutTube video handling
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * locale changes .. modal-paypal-not-verified-title
 * hide qtip before disabling
 * globarockstar -> globalrockstar
 * post update of vote
 * try to fix tooltip not hiding GR-1164
 * update how-to-vote video GR-1176
 * implement fan statistics
 * reset audioplayer time on reload GR-1168
 * comment unused PayPal config in fronteed
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * Delete createFakePayment method
 * add promo video again
 * typo
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * Make PayPal updates more explicit - log 'em all!
 * add download attribute to "force" download of file GR-1169
 * use voucher before checking if user is paypal verified
 * do not stop watching on touch
 * stageChange event is only firing on init on touch devices
 * add maxsockets in index
 * update texts vor verified account
 * harden paypal form
 * Merge branch 'master' into stage
 * check if paypal present
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * Mark PayPal forms as initialised. Skip when form is already initialised.
 * add initpaypalform directive
 * Merge branch 'stage' of git.lan.ddg:global-rockstar/global-rockstar-frontend into stage
 * fix text concat
 * Merge branch 'master' into stage
 * Merge branch 'stage' of vcs.diamonddogs.cc:globalrockstar-frontend into stage
 * remove unparseable angular code
 * Merge branch 'stage' of git.lan.ddg:global-rockstar/global-rockstar-frontend into stage
 * Merge branch 'stage' of vcs.diamonddogs.cc:globalrockstar-frontend into stage
 * amazon config changed -> paypal
 * make cdn dynamic
 * Merge branch 'master' into stage
 * resetted -> reset
 * Merge branch 'master' into stage
 * fix rocknvotes texts
 * Merge branch 'master' into stage
 * fix qtip updating for not-logged-in user
 * Merge branch 'master' into stage
 * replace this song with artist name
 * add tooltip to listen to a song
 * add artist name to RNV temp unavailable
 * add how to vote to arena
 * remove news from main navigation GR-1150
 * Text adaptions for release 2014/09/15.
 * remove text from thanks page
 * Merge branch 'master' into stage
 * added beautifier
 * fixed youtube videos in arena for touch devices
 * Merge branch 'master' into stage
 * changes by alex
 * Merge branch 'master' into stage
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * * Enable PayPal verification on Participate form * Don't allow to remove PayPal data when artist has an active Project
 * added paypal modal to voucher buy button
 * Merge branch 'master' into stage
 * removed log
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * finished paypal modal
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * Fix strange PP Form behaviour
 * give beaufifyNumber option for representing a 0
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * added paypal modal in arena
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * Implement PayPal Form in Projects Admin
 * added modal for non verified paypal accounts
 * arena fixes
 * fixed styling
 * fixed arena bugs
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * fixed artist rank
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * add sort order
 * fixed missing:
 * added ai request for twitter config
 * fixed bug
 * style updates
 * added task to remove debug statements from js code
 * arena refinements
 * Merge branch 'master' into stage
 * fix typo
 * Merge branch 'master' into stage
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * add frontendurl to configs and paypal return url
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * tweet length enhancements
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * use package title for paypal entry
 * vote facebook and twitter votes right after click
 * add already voted feedback in arena
 * implement voting failure on profile
 * updated modal style
 * beautify votes
 * added deleted state
 * changed headlines
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * used project currency in pledge buttons
 * removed space
 * fans routes and stuff
 * Merge branch 'master' into stage
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * Updated locales
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * media query fix for hero video slide retina icons
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * Updated error message on Crowdfunding projects
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * deactivated money transfer
 * deactivated link for incomplete users
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * reload page after project donation popup closed
 * changed protocol
 * fixed project detail details
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * fixed play count of videos
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * no hover style for btn and links with disabled class
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * show nominate button if no nominations
 * register boxes full link box and all blue
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * submit button in box footer
 * corwdfunding no projects msg wording
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * fix condition for participate window
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * changed wording
 * Merge branch 'master' into stage
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * bank labels added
 * add live paypal account
 * Merge branch 'master' into stage
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * fixed login route when user is inactive or terms are uepdate
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * use language file for packages modal
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * Updated text for payment of package
 * wording modal
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * added file replacement to projects
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * fixed published state label
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * removed video slide work in progress
 * show votes and credits if they are >= 0
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * fine tuning
 * use language file for state labels
 * wording stuff
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * do not show credits for 2013
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * changed label classes and added them to backstage tables
 * fixed merge conflict
 * fixed paypal dummy vote in arena
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * remove test text
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * Added help texts, changed some locals
 * extract i18n creation to lib
 * only show text on crowdfunding projects
 * remove console log in app
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * massive removal of console log + dir
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * added label styles
 * some wording
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * Add form action to make filters work again
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * add action to prevent angular from hijacking form
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * styles fine tuning
 * fixed fans in box
 * facebook tests
 * changed text stringÄ
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * facebook tests
 * add earnings to stats
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * fix typo for payment in progress
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * fixed box colors and states
 * hero changes for video slide
 * fixes by alex
 * woring on dummy votes
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * fixed votes
 * added line breaks before optinal messages
 * add feedback for donation GR-1078
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * add overall earnings
 * fixed paypal in arena
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * GR-110 Löschen auf eigener Seite statt via Modal
 * Fix textarea description text rendering
 * remove consoles
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * trigger resize for header carousel
 * fixed merge conflict
 * fixed bug when artist has alredy one song with that url
 * Table styling & flash message on successful payment
 * UI Strings & design
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * added rejections
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * do not show voted serie in badges
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * added responsive table directive for statistics table
 * fixed duplicated fans
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * closed stats box on load
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * add position to badges
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * ui strings
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * fixed replacing of audio files in arena, and also fixed counting of plays
 * remove some log noise
 * Add app task to default target
 * moved replacement functions and grouped them
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * more fine tuning
 * fixed accordion
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * and now we append the texts right
 * fixed wording in modals
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * tablet fine tuning stuff
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * only show contest stats if there are votes
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * fixed currency values on artist profile
 * Merge branch 'master' into payment
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * packages and media library fine tune
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * finished require veriified user directive, added modal
 * changed status button style
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * update feedback text GR-601
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * created directive to check if user is verified
 * show votes and credits if song has a contest
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * extract dummy vote creation
 * fixed audio/video switch for guests
 * added artist profile url to fb share
 * added artist profile url to tweet
 * fixed wrong tweet text, when button was enabled but not clickes
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * changes for media library and packages page
 * hide reload button on page load
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * fixed twitter feedback
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * packages feedback modal added
 * Crowdfunding Detail Rework
 * PayPal live setting in stage config
 * Implement Transfer payments
 * fixed paypal text
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * fixed upcounting of earnings
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * update text and container of vouchers left
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * changed and added package/payment modals
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * reverted mobiel payment options
 * only trigger submit if target is not button
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * temp remove submit form
 * added another fallback to fix mobile payments
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * removed paypal touch switch
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * count up plays
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * changes payment modal styles
 * fixed strict mode bug
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * fixed broken images onload
 * fixed  broken modal
 * added app to build task
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * removed merge comments
 * fixed broken merge conflict
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * dummy vote should not modify response
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * text overflow artist profile
 * fixed merge conflict
 * merge
 * fixed paypal buttons
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * fix voucher buy button
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * fixed country mode
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * add artist name to buttons
 * fixed merge conflict
 * fixed modal after vote
 * added bottom margin for crowdfunding project boxes
 * Style changes for backstage boxes
 * define voting feedback for arena
 * add data to event
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * changed styles and behavior for packages modal
 * fixed modal after vote
 * do not show chart position if it is 0
 * update locale
 * reduce voucher count after vote
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * add votesleft on right side
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * fixed position of modals and added click buttons to close
 * fix voting options in feedback GR-10
 * reload button text top 20px
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * arena voting fixes
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * fixed yt api bug
 * fix image paths for slots
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * deactivated blocks
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * add badges
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * fixed indentation
 * fix fb url
 * added facebook script
 * remove temp overlays
 * enable old arena
 * starting video player playtime observer
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * hide reload button when reloading, enabled counting of videos, added check if user has vouchers
 * fix show hide animation
 * ensure that animation is always running
 * fix profile paypal vote
 * allow url or slug in link
 * get fb voting working in arena and profile
 * get disabled state of buttons
 * use link and not compile for require login directive
 * disabled button after vote
 * enabled feedback modal safter vote in arena
 * fixed merge conflict
 * added paypal votings in arena
 * fix errors for voting
 * fix require login on artist detail
 * animate overlay with ng animate
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * fix animation
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * created sponsor directive, finished vote button directive
 * reimplement stats
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * add sidebar stats
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * icon fixes
 * Merge branch 'crowdfunding'
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * add votes and credits to song
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * fixed merge conflict
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * song stats in angular
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * Merge remote-tracking branch 'origin/v1.0-hotfix'
 * fixed merge conflict
 * reload youtube video
 * Merge branch 'master' into crowdfunding
 * do not show stats for legacy songs
 * added testing image
 * block/box/grid classes cleanup
 * clean up box and block classes
 * changes for fan profile according to artist profile changes
 * add css3 animation for arena
 * add animation loading condition
 * get my beloved beautifyDate back
 * reply immediatly for xhr request on switch mode
 * add details to match for angular FE
 * rename old to old and new to /arena
 * add meta tags for artist profile
 * add description to require login directive
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * transform statistics to angular
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * arena stuff
 * add optional song id for artist stats
 * check for length of filtered packages
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * verify that artist without songs gets profile
 * implement isFan
 * fix voting for song not in contest
 * fix order in require login
 * add require login on voting options and become fan button
 * add require login directive
 * fix syntax error
 * created media player directives
 * load paypal with getScript()
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * started with arena rebuild
 * fill in badges and statistics from client
 * enable crowdfunding
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * implement all properties for notifications
 * fixed an error after login, when terms are update
 * added clearfix
 * Merge branch 'master' of git.lan.ddg:global-rockstar/global-rockstar-frontend
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * removed logs
 * added mobile vote fallbacks
 * fix notifications indentation
 * use purchase not supervote
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * implement notifications
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * created directive to close overlay
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * show remaining packages
 * cleanup
 * added async paypal/voucher switch
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * added voucher votes
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * disable become fan button on own profile
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * created route to retrieve vouchervotes
 * Merge branch 'v1.0-hotfix'
 * fixed dark box on loading
 * remove console
 * fix check for ip
 * integrated paypal voting
 * remove @TODOs vote
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * show only packages with rewards, but allow to buy all
 * fixed bug
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * fixed disabling of voting buttons
 * add beautify money
 * add value service for profile and use it
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * show popup for vouchers
 * modals stuff
 * some modal improvements
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * created controller for modals
 * fix for device check for video overlay event
 * arena redesign
 * get Currency fix
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * voucher controller shows packages, hurray!!!!
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * vote paypal directive
 * reenable crowd funding
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * Testing YouTube-Replacement for Mobile Devices
 * Merge branch 'v1.0-hotfix' of vcs.diamonddogs.cc:globalrockstar-frontend into v1.0-hotfix
 * artist profile changed
 * fixed merge coflict
 * vote with twitter and facebook directives
 * Merge branch 'stage' of vcs.diamonddogs.cc:globalrockstar-frontend into stage
 * add error handler for normal error
 * add error handler for normal error
 * add service for packages
 * Reenable Corwdfunding
 * add partials controller
 * dd good
 * remove active in currentcontest, that should come from api
 * fixed audio player height to fit sponsor banner
 * Merge branch 'stage' of vcs.diamonddogs.cc:globalrockstar-frontend into stage
 * added newrelic
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * change password indicator text left and simple form fields
 * charts artist and song title length with ellipsis overflow
 * contact form adaptions
 * moved box
 * Merge branch 'v1.0-hotfix' of vcs.diamonddogs.cc:globalrockstar-frontend into v1.0-hotfix
 * created endpoint for statistics
 * metaheader and country selector changes
 * mobile menu fix
 * Merge branch 'v1.0-hotfix' into stage
 * Merge branch 'v1.0-hotfix' of vcs.diamonddogs.cc:globalrockstar-frontend into v1.0-hotfix
 * use search country
 * use song country before artist country
 * fix paging on contestants
 * backstage changes
 * update time to contest phase
 * fixed artist slug in songs carousel
 * add song in contest
 * box changes
 * fixed merge conflict en.json
 * Merge branch 'v1.0-hotfix' of vcs.diamonddogs.cc:globalrockstar-frontend into v1.0-hotfix
 * changes for new terms
 * use captial R for recommendation GR-776
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * do not show current song in songs carousell
 * responsive navigation styles
 * changed background image blocks (jpg instead png and responsive padding bottom)
 * switched media partner and brand logo in responsive layouts
 * fixed merge conflict
 * added filter, update video counts
 * ignore tmp file
 * responsive styles for simple and default slider
 * add missing files
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * use new aritst detail route
 * removed live reload from gulp-dg task
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * Merged
 * really all fans bug
 * fixed merge conflict
 * created fan box action
 * removed live reload from dg task
 * wrap form textarea in grid item
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * contact form style adaptions (whitespace hack)
 * code review 1
 * created snippet
 * added angular fan binding
 * only show change nomination box if phase is only cfe GR-990 GR-792
 * do not show nominate button if np is already running GR-792 GR-990
 * fix endless loading after deleted user login
 * add sort by recommendation to artists index GR-776
 * add sort by recommendation GR-775
 * take the real fans not the random ones ..
 * merged artist profile
 * scaffolded angular app
 * do not validate paypal data
 * Merge branch 'v1.0-hotfix'
 * Merge branch 'v1.0-hotfix'
 * show participate for not nominated pending songs
 * added angular
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * intendation
 * fixed vorder-bottom class
 * disabled logs
 * check countries for euro
 * show participate box for allowed users
 * enabled facebook comments on all profiles
 * check countries for euro
 * Merge branch 'master' of vcs.diamonddogs.cc:globalrockstar-frontend
 * do not verify paypal address
