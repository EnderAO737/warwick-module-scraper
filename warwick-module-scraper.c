#include <stdio.h>
#include <curl/curl.h>

int main(int argc, char* argv) {

	char* makeRequest(char* url){
		CURL *curl;
		CURLcode res;
		curl = curl_easy_init();
		if(curl){
			curl_easy_setopt(curl, CURLOPT_URL, url);
			res = curl_easy_perform(curl);
			curl_easy_cleanup(curl);
			return res;
		}
		return "ERROR";
	}

	printf("%s", makeRequest("https://www.google.com"));


	return 0;
}
